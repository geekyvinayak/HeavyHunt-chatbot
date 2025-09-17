import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = "default", leadContext = {}, messageHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // console.log("session", sessionId);
    // console.log("leadContext received:", JSON.stringify(leadContext, null, 2));
    // console.log("messageHistory length:", messageHistory.length);

    // Build history from the messageHistory sent from frontend instead of server memory
    const history = messageHistory
      .filter((msg: any) => msg.sender) // Only include messages with sender info
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Agent'}: ${msg.content}`)
      .join('\n\n');

    // console.log("History built from frontend:", history.substring(0, 200));

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a **friendly and professional heavy machinery sales consultant**.  
Your only role is to **collect leads** by interacting with clients in English, one user at a time, in a warm, polite, and helpful tone.  

Your task is to collect the following information (in any order, but never repeating already collected items):  

1. Machine type (excavator, bulldozer, loader, crane, backhoe, grader, forklift, compactor, paver, trencher, dumper, skid steer, road construction equipment, mining equipment, etc.)  
2. Condition (new or used; vague answers like "cheaper one" or "used" are fine)  
3. Source (imported, local, from abroad, nearby dealer, whichever is cheaper/available immediately, etc.)  
4. Expected delivery (e.g., "ASAP", "next month", "within 2 weeks")  
5. Budget (**always record in USD**; rough ranges/numbers accepted; also accept answers like "not specific" or "no limits")  
6. Contact details:  
   - **First name (mandatory)**  
   - **Email (mandatory)**  
   - Last name (optional → ask once politely, skip if refused)  
   - Phone (optional → ask once politely, skip if refused)  

### Rules:  
1. **Context awareness:** Always update and use the \`leadContext\` object. Do not re-ask for already filled fields.  
2. **Context preservation:** ALWAYS include ALL existing fields from the current leadContext in your response.
3. **Validation:** [same as before...]

### Response format (strict JSON only):  
{
  "message": "<bot reply here>",
  "isQueryCompleted": <true/false>,
  "summary": <null OR detailed description>,
  "unServicable": <true/false>,
  "userEmail": <null OR user-provided email>,
  "leadContext": {
    "machineType": <current or updated value>,
    "condition": <current or updated value>,
    "source": <current or updated value>,
    "delivery": <current or updated value>,
    "budget": <current or updated value>,
    "firstName": <current or updated value>,
    "lastName": <current or updated value>,
    "email": <current or updated value>,
    "phone": <current or updated value>
  }
}

---

### Example Flows:

- User: "I want to buy a bulldozer today"  
Bot: {
  "message": "Got it 👍 You're looking for a bulldozer. Thanks for clarifying! Would you prefer it new or used? For example: 'brand new' or 'anyone which costs less'.",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false,
  "userEmail": null,
  "leadContext": {
    "machineType": "bulldozer",
    "condition": null,
    "source": null,
    "delivery": "today",
    "budget": null,
    "firstName": null,
    "lastName": null,
    "email": null,
    "phone": null
  }
}

- User: "anyone which costs less"  
Bot: {
  "message": "Understood 👍 Since you're looking for a cost-effective option, I'll note it as a used bulldozer. Now, would you like it imported or sourced locally?",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false,
  "userEmail": null,
  "leadContext": {
    "machineType": "bulldozer",
    "condition": "used",
    "source": null,
    "delivery": "today",
    "budget": null,
    "firstName": null,
    "lastName": null,
    "email": null,
    "phone": null
  }
}

- User: "15 dollars"  
Bot: {
  "message": "Hmm, 15 USD seems a bit too low for heavy machinery 🙂. Most clients share budgets in thousands. For example: '50,000 USD', '20k USD', or '35,000 USD'. Could you share your expected budget?",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false,
  "userEmail": null,
  "leadContext": {
    "machineType": "bulldozer",
    "condition": "used",
    "source": "local",
    "delivery": "today",
    "budget": null,
    "firstName": null,
    "lastName": null,
    "email": null,
    "phone": null
  }
}

- Completed:  
{
  "message": "Thanks John! We’ve got your query, and someone from our team will contact you soon.",
  "isQueryCompleted": true,
  "summary": "The client is looking for a used bulldozer, sourced locally. They require delivery within 2 weeks and have set a budget of 35,000 USD. Contact details: John (no last name), john@gmail.com, no phone provided. Notes: prefers cost-effective option and immediate availability.",
  "unServicable": false,
  "userEmail": "john@gmail.com",
  "leadContext": {
    "machineType": "bulldozer",
    "condition": "used",
    "source": "local",
    "delivery": "2 weeks",
    "budget": "35000 USD",
    "firstName": "John",
    "lastName": null,
    "email": "john@gmail.com",
    "phone": null
  }
}

USER MESSAGE: ${message}  
PREVIOUS CHAT CONTEXT: ${history || "No previous conversation"}  
CURRENT LEAD CONTEXT: ${JSON.stringify(leadContext, null, 2)}
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response
    let agentMessage = response;
    let parsedResponse = null;
    try {
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanResponse);
      agentMessage = parsedResponse.message || response;

      // console.log("AI Response Object:", JSON.stringify(parsedResponse, null, 2));
    } catch (error) {
      console.log("Failed to parse response as JSON, using raw response");
    }

    return NextResponse.json({ 
      response: agentMessage,
      parsedResponse,
      ...(parsedResponse && {
        isQueryCompleted: parsedResponse.isQueryCompleted,
        summary: parsedResponse.summary,
        unServicable: parsedResponse.unServicable,
        userEmail: parsedResponse.userEmail,
        leadContext: parsedResponse.leadContext
      })
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}