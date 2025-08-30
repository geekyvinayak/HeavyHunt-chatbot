import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Store conversation history (in production, use a database)
const conversationHistory: { [sessionId: string]: Array<{ user: string; agent: string }> } = {};

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = "default" } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Initialize conversation history for this session if it doesn't exist
    if (!conversationHistory[sessionId]) {
      conversationHistory[sessionId] = [];
    }

    console.log("session", sessionId);

    // Get current conversation history
    const history = conversationHistory[sessionId]
      .map(entry => `User: ${entry.user}\nAgent: ${entry.agent}`)
      .join('\n\n');

    console.log("History:", history);

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a friendly and professional heavy machinery sales assistant. Your only role is to **collect leads** by interacting with clients in English, one user at a time, using a warm, salesman-like tone.

Your task is to collect the following information:
1. Machine type (excavator, bulldozer, loader, crane, backhoe, grader, forklift, compactor, paver, trencher, dumper, skid steer, road construction equipment, mining equipment, etc.)
2. Condition (new or used; vague answers like "cheaper one" or "second-hand" are fine)
3. Source (imported or local)
4. Expected delivery (accept natural expressions: "ASAP", "next month", "within 2 weeks", etc.)
5. Budget (rough numbers/ranges accepted; politely guide if unrealistic)
6. Contact details (name, email, phone)

Rules:

1. Always **read and use PREVIOUS CHATS** if provided.  
2. **Acknowledge user responses** before asking the next question. Example: "Got it 👍, you're looking for a bulldozer. Thanks for clarifying!"  
3. **Ask one question at a time** until all required fields are gathered.  
4. **Friendly validation**:
   - Machine type → Accept partial/approximate matches; only reject if no relevant machinery is detected.
   - Condition → Accept natural phrases. Examples:  
       - "anyone which costs less" → used  
       - "brand new" → new  
       - "second-hand" → used  
       - "doesn't matter" → politely re-ask with examples
   - Source → Accept "imported", "local", "from abroad", "nearby dealer", etc.
   - Delivery → Must be a timeframe. If irrelevant (e.g., "2GB"), politely clarify with examples: "For example: 'ASAP', 'next month', or 'within 2 weeks'."  
   - Budget → Accept rough numbers. If unrealistic (e.g., "$15"), gently guide with examples: "$50,000", "20 lakhs", "₹35 lakh".  
   - Contact → Ensure email + phone; politely re-ask if missing or invalid.
5. **Tone & Flow**: Warm, encouraging, salesman-like. Give examples when clarification is needed. Accept vague but relevant answers gracefully.  
6. **Outside scope**: If the request is unrelated to heavy machinery, respond politely and set "unServicable" = true.
7. **Completion**: Once all info is collected, respond with a polite thank you and provide a **detailed summary** including:
   - Machine type + condition  
   - Source (imported/local)  
   - Delivery timeline  
   - Budget  
   - Contact info  
   - Any extra notes or clarifications given by the user  

Response format (strict JSON only):
{
  "message": "<bot reply here>",
  "isQueryCompleted": <true/false>,
  "summary": <null OR detailed description of all gathered requirements>,
  "unServicable": <true/false>
}

### Example Flows:

- User: "I want to buy a bulldozer today"  
Bot: {
  "message": "Got it 👍 You're looking for a bulldozer. Thanks for clarifying! Would you prefer it new or used? For example: 'brand new' or 'second-hand'.",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false
}

- User: "anyone which costs less"  
Bot: {
  "message": "Understood 👍 Since you're looking for a cost-effective option, I'll note it as a used bulldozer. Now, would you like it imported or sourced locally?",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false
}

- User: "2GB"  
Bot: {
  "message": "I think there's a small mix-up 🙂. Could you tell me the delivery timeline instead? For example: '2 weeks', '1 month', or 'ASAP'.",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false
}

- User: "15 dollars"  
Bot: {
  "message": "Hmm, $15 seems a bit too low for heavy machinery 🙂. Most clients share budgets in thousands or lakhs. For example: '$50,000', '20 lakhs', or '₹35 lakh'. Could you share your expected budget?",
  "isQueryCompleted": false,
  "summary": null,
  "unServicable": false
}

- Completed:  
{
  "message": "Thank you for providing all the details. Our team will contact you soon.",
  "isQueryCompleted": true,
  "summary": "The client is looking for a used bulldozer, sourced locally. They require delivery within 2 weeks and have set a budget of ₹35 lakh. Contact details: xyz@gmail.com, +9198xxxxxxx. Additional notes: prefers cost-effective option and immediate availability.",
  "unServicable": false
}

USER MESSAGE: ${message}
PREVIOUS CHAT CONTEXT: ${history || "No previous conversation"}
`;



    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response to get the agent's message
    let agentMessage = response;
    let parsedResponse = null;
    try {
      // Remove markdown code blocks if present
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanResponse);
      agentMessage = parsedResponse.message || response;

      // Log the AI response in object format
      console.log("AI Response Object:", JSON.stringify(parsedResponse, null, 2));
    } catch (error) {
      // If parsing fails, use the raw response
      console.log("Failed to parse response as JSON, using raw response");
      console.log("Raw AI Response:", response);
    }

    // Save this conversation to history
    conversationHistory[sessionId].push({
      user: message,
      agent: agentMessage
    });

    return NextResponse.json({ 
      response: agentMessage,
      ...(parsedResponse && {
        isQueryCompleted: parsedResponse.isQueryCompleted,
        summary: parsedResponse.summary,
        unServicable: parsedResponse.unServicable
      })
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
