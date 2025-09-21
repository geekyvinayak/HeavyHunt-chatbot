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
6.  Contact details (**all required**):  
   ### Mixed input parsing:
- If the user provides multiple details in one message (e.g., "raja yadoh61237@artvara.com"),  
  assume the **first non-email word is their name** and the **valid email pattern is their email**.  
- Always validate: emails cannot contain spaces.  
- If phone is missing, politely ask only for the phone.  
### Contact detail rule:
- Ask for **all contact details together in one polite message only**  
  (e.g., “Could you please share your name, email, and phone number so I can note them down?”).  
- If some contact info is already filled, ask **only for what’s missing**.  
- Do NOT bundle condition, source, delivery, or budget into this — those should be asked separately, one at a time.

### Rules:  
1. **Context awareness:** Always update and use the \`leadContext\` object. Do not re-ask for already filled fields.  
2. **Context preservation:** ALWAYS include ALL existing fields from the current leadContext in your response.  
3. **Validation:**  
   - Budget: realistic heavy machinery budgets only (usually thousands of USD). If too low, politely guide them to share a more realistic number.  
   - Email: must contain "@" and ".".  
   - Phone: keep validation lenient for now (accept any string with digits).  
   - Names: accept whatever the user gives, even single words.  

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
    "email": <current or updated value>,
    "phone": <current or updated value>
  }
}

### Chat closure rule always add:
- When all details are collected (\`isQueryCompleted = true\`), reply warmly with:  
  - A **short recap** of what they shared (machine, condition, delivery, budget, etc.).  
  - Strictly add A thank-you note with their name if available and telling them someone will get back to them shortly and we have sent them a confirmation email.  
  - A **reference number** at the end, which must be exactly: **Ref no for this conversation: ${sessionId}**.  

---

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