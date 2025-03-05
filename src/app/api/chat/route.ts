import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define interfaces for better type safety

interface IntentHandler {
  pattern: RegExp;
  domains: string[];
}

// Enhanced context retrieval from Supabase knowledge base
async function retrieveRelevantContext(query: string): Promise<string> {
  // Pre-process query for better matching
  const cleanQuery = query.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\b(?:what|how|who|is|the|a|an|do|does|did|can)\b/g, '') // Remove stop words
    .trim();

  // Intent handlers with priority order
  const intentHandlers: IntentHandler[] = [
    { pattern: /price|cost|how much|\$/, domains: ["Pricing & Offers", "Product Information"] },
    { pattern: /about|tell me|what is|company|mission/, domains: ["About", "Product Overview"] },
    { pattern: /technical|spec|dimension|weight|size/, domains: ["Technical Specifications", "Features & Inclusions"] },
    { pattern: /market|country|usage|stat|review/, domains: ["Trusted", "Main Markets", "Business Partnership & Franchise Model"] },
    { pattern: /order|purchase|buy|where get/, domains: ["Product Information", "Pricing & Offers"] },
    { pattern: /shipping|logistics|lead time/, domains: ["Shipping & Logistics"] },
    { pattern: /maintenance|consumables|filter|bulb/, domains: ["Consumables & Maintenance Costs"] },
    { pattern: /franchise|distributor|partnership/, domains: ["Business Partnership & Franchise Model", "Exclusivity"] },
    { pattern: /roi|profit|revenue/, domains: ["ROI Analysis", "Business Partnership & Franchise Model"] },
    { pattern: /faq|question/, domains: ["Frequently Asked Questions"] }
  ];

  // First, try to match intent-specific domains
  for (const { pattern, domains } of intentHandlers) {
    if (pattern.test(cleanQuery)) {
      const { data } = await supabase
        .from('knowledge_base')
        .select('content')
        .in('domain', domains)
        .limit(2);

      if (data && data.length > 0) {
        console.log(`Intent matched: ${pattern} - returning ${domains.join(', ')}`);
        return data.map(item => item.content).join('\n\n');
      }
    }
  }

  // Fallback to semantic search if no specific intent matches
  const queryKeywords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
  
  // Use Postgres full-text search
  const { data } = await supabase
    .from('knowledge_base')
    .select('content, domain')
    .textSearch('content', queryKeywords.join(' & '), {
      type: 'websearch'
    })
    .limit(2);

  if (data && data.length > 0) {
    console.log(`Semantic search results for keywords: ${queryKeywords.join(', ')}`);
    return data.map(item => 
      `// Domain: ${item.domain}\n${item.content}`
    ).join('\n\n');
  }

  // If no results, fetch top 2 general domains
  const { data: defaultData } = await supabase
    .from('knowledge_base')
    .select('content, domain')
    .in('domain', ['Product Overview', 'Pricing & Offers'])
    .limit(2);

  if (defaultData && defaultData.length > 0) {
    return defaultData.map(item => 
      `// Domain: ${item.domain}\n${item.content}`
    ).join('\n\n');
  }

  return "No relevant information found in the knowledge base.";
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
      'HELMETPRO_SYSTEM_PROMPT_BASE',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    requiredEnv.forEach(varName => {
      if (!process.env[varName]) throw new Error(`Missing ${varName}`);
    });

    // Set API key explicitly
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY!;
    }

    // Context retrieval from Supabase
    const context = await retrieveRelevantContext(userMessage);
    console.log("Selected context:", context.slice(0, 150) + "...");

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