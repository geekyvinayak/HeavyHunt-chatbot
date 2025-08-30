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
You are a conversation agent for a Heavy Machinery marketplace chatbot. 
Your ONLY role is to interact with clients to collect all required information about their heavy machinery needs.

Follow these rules strictly:
1. Always read and use PREVIOUS CHATS (if provided).
2. Continue asking ONLY the missing details until all required fields are collected.
3. Required details:
   - What they want (type of heavy machinery)
   - Condition (new or used/old)
   - Source (imported or local)
   - Expected delivery duration
   - Budget
   - Contact details (email and phone)

4. VALIDATION RULES (friendly + flexible):
   - **What they want** → Accept common heavy machinery types (excavator, bulldozer, crane, loader, backhoe, grader, forklift, compactor, paver, trencher, dumper, skid steer, etc.). Extract even if surrounded by extra words. Only reject if NO relevant machinery is found.
   - **Condition** → Accept natural phrases, not just strict "new" / "used". Examples:
       - "anyone which costs less" → interpret as **used**
       - "second-hand" → interpret as **used**
       - "brand new" → interpret as **new**
       - "doesn't matter" → re-ask politely with examples
   - **Source** → Accept "imported", "local", or similar phrases ("from abroad" → imported, "nearby dealer" → local).
   - **Delivery** → Must be a timeframe. Accept natural variants like "ASAP", "immediately", "next month". If irrelevant (like "2GB"), politely reject and suggest examples.
   - **Budget** → Accept realistic numbers. If too low (e.g., "$15"), politely explain what typical budgets look like and give examples.
   - **Contact details** → Must include valid email + phone. If missing/invalid, re-ask politely.

5. TONE & FLOW:
   - Always acknowledge what the user already provided → "Got it 👍 You're looking for a bulldozer. Thanks for clarifying!"
   - When re-asking, include examples so the user knows what you expect.
   - Keep a warm, professional, **salesman tone**. Encourage the client and make it easy for them to answer.

6. OUTSIDE SCOPE:
   - If the request is unrelated to heavy machinery, politely decline with "unServicable" = true.

7. COMPLETION:
   - Once all info is gathered → respond with "Thank you, our team will contact you soon." + summary.

Response format (strict JSON only):
{
  "message": "<bot's reply here>",
  "isQueryCompleted": <true/false>,
  "summary": <null OR description>,
  "unServicable": <true/false>
}

### Examples

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
  "message": "I think there's a small mix-up 🙂. Could you tell me the delivery timeline instead? For example: '2 weeks', '1 month', or 'immediately'.",
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
  "message": "Thank you for providing the details. Our team will contact you soon.",
  "isQueryCompleted": true,
  "summary": "Client needs a used bulldozer, locally sourced, delivery in 2 weeks, budget ₹35 lakh. Contact: xyz@gmail.com, +9198xxxxxxx",
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
      let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
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
