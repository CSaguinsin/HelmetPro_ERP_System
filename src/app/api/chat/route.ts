import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export const maxDuration = 30;

// Define interfaces for better type safety
interface OrderDetails {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  quantity?: number | string;
  comments?: string;
}

interface IntentHandler {
  pattern: RegExp;
  sections: string[];
}

// Enhanced context retrieval with semantic chunking and intent detection
function retrieveRelevantContext(query: string, knowledgeBase: string): string {
  // Split knowledge base into meaningful chunks based on section headers
  const chunks = knowledgeBase.split(/(?=\/\/ [A-Z][a-z]+)/g)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 50); // Remove small fragments

  console.log("Total chunks processed:", chunks.length);

  // Pre-process query for better matching
  const cleanQuery = query.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\b(?:what|how|who|is|the|a|an|do|does|did|can)\b/g, '') // Remove stop words
    .trim();

  // Intent handlers with priority order
  const intentHandlers: IntentHandler[] = [
    { pattern: /price|cost|how much|\$/, sections: ["Product Information"] },
    { pattern: /about|tell me|what is|company|mission/, sections: ["About", "Product Information"] },
    { pattern: /technical|spec|dimension|weight|size/, sections: ["Technical Specifications"] },
    { pattern: /market|country|usage|stat|review/, sections: ["Trusted", "Main Markets"] },
    { pattern: /order|purchase|buy|where get/, sections: ["Product Information"] }
  ];

  // Check for specific intents first
  for (const { pattern, sections } of intentHandlers) {
    if (pattern.test(cleanQuery)) {
      const matchedChunks = chunks.filter(chunk => 
        sections.some(section => chunk.startsWith(`// ${section}`))
      );
      if (matchedChunks.length > 0) {
        console.log(`Intent matched: ${pattern} - returning ${sections.join(', ')}`);
        return matchedChunks.join('\n\n');
      }
    }
  }

  // Semantic scoring for general queries
  const queryKeywords = new Set(cleanQuery.split(/\s+/).filter(w => w.length > 2));
  
  const scoredChunks = chunks.map(chunk => {
    const chunkContent = chunk.toLowerCase();
    let score = 0;

    // Section priority weighting
    if (chunk.startsWith("// Product Information")) score += 15;
    if (chunk.startsWith("// Technical Specifications")) score += 12;
    if (chunk.startsWith("// About")) score += 10;

    // Keyword matching with proximity bonus
    Array.from(queryKeywords).forEach(keyword => {
      const matches = chunkContent.match(new RegExp(`\\b${keyword}\\b`, 'g')) || [];
      score += matches.length * 5;
      
      // Bonus for multiple keyword matches
      if (matches.length > 1) score += 10;
    });

    // Full match bonus
    if (Array.from(queryKeywords).every(k => chunkContent.includes(k))) {
      score += 20;
    }

    return { chunk, score };
  });

  // Select top chunks based on score
  const relevantChunks = scoredChunks
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(c => c.chunk);

  return relevantChunks.length > 0 
    ? relevantChunks.join('\n\n')
    : chunks.slice(0, 2).join('\n\n'); // Fallback to first sections
}

// Google Sheets integration for order saving
async function saveOrderToGoogleSheets(orderDetails: OrderDetails): Promise<boolean> {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY || 
        !process.env.GOOGLE_SHEET_ID) {
      console.error("Missing Google Sheets configuration");
      return false;
    }
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.addRow({
      timestamp: new Date().toISOString(),
      name: orderDetails.name,
      email: orderDetails.email,
      phone: orderDetails.phone || '',
      company: orderDetails.company || '',
      address: orderDetails.address || '',
      quantity: orderDetails.quantity || '',
      comments: orderDetails.comments || ''
    });
    
    console.log("Order saved successfully");
    return true;
  } catch (error) {
    console.error("Sheets save error:", error);
    return false;
  }
}

// Order details extraction
function extractOrderDetails(message: string): OrderDetails | null {
  const details: Partial<OrderDetails> = {};
  const fields: Record<keyof OrderDetails, string[]> = {
    'name': ['name', 'full name'],
    'email': ['email'],
    'phone': ['phone', 'contact number'],
    'company': ['company', 'business'],
    'address': ['address', 'shipping'],
    'quantity': ['quantity'],
    'comments': ['comments', 'notes']
  };

  message.split('\n').forEach(line => {
    const [keyPart, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();
    
    Object.entries(fields).forEach(([field, keywords]) => {
      if (keywords.some(k => keyPart?.toLowerCase().includes(k))) {
        details[field as keyof OrderDetails] = value;
      }
    });
  });

  return (details.name && details.email) ? details as OrderDetails : null;
}

// Order form detection
function isOrderFormSubmission(message: string): boolean {
  const requiredFields = ['name', 'email', 'phone|address'];
  return requiredFields.every(field => 
    field.split('|').some(f => 
      new RegExp(`${f}:`, 'i').test(message)
    )
  );
}

// Enhanced system prompt construction
function buildSystemPrompt(context: string, isOrderIntent: boolean): string {
  const basePrompt = process.env.HELMETPRO_SYSTEM_PROMPT_BASE!
    .replace("{{CONTEXT}}", context);

  const directives = [
    "NEVER mention you're an AI assistant",
    "If asking for clarification, suggest possible options from the context",
    "For numerical data, always use exact values from context",
    "When unsure, respond with: 'Based on our documentation:' followed by relevant context excerpt"
  ];

  if (isOrderIntent) {
    directives.push(
      "Direct users to complete the order form with required details",
      "Never suggest pricing or features not in the context"
    );
  }

  return `${basePrompt}\n\nStrict Rules:\n${directives.map((d, i) => `${i+1}. ${d}`).join('\n')}`;
}

// Main API endpoint
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1]?.content || "";
    console.log("User message received:", userMessage);

    // Validate required environment variables
    const requiredEnv = [
      'GEMINI_API_KEY', 
      'HELMETPRO_KNOWLEDGE_BASE',
      'HELMETPRO_SYSTEM_PROMPT_BASE'
    ];
    requiredEnv.forEach(varName => {
      if (!process.env[varName]) throw new Error(`Missing ${varName}`);
    });

    // Set API key explicitly
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY!;
    }

    // Context retrieval
    const context = retrieveRelevantContext(userMessage, process.env.HELMETPRO_KNOWLEDGE_BASE!);
    console.log("Selected context:", context.slice(0, 150) + "...");

    // Order form handling
    if (isOrderFormSubmission(userMessage)) {
      const orderDetails = extractOrderDetails(userMessage);
      if (orderDetails) {
        const success = await saveOrderToGoogleSheets(orderDetails);
        return streamText({
          model: google("gemini-1.5-pro"),
          messages: [{
            role: "system",
            content: success 
              ? "Confirm order submission and mention email follow-up"
              : "Apologize and suggest alternative contact methods"
          }]
        }).toDataStreamResponse();
      }
    }

    // Build AI prompt
    const isOrderIntent = /order|purchase|buy/i.test(userMessage);
    const systemPrompt = buildSystemPrompt(context, isOrderIntent);

    // Generate AI response
    const response = await streamText({
      model: google("gemini-1.5-pro"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4,
      maxTokens: 500,
      topP: 0.95,
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 }
    );
  }
}