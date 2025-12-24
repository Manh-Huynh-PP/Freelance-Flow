'use server';

import { chatWithAI, type ChatRequest } from '@/ai/simple-ai';
import type { AskAboutTasksInput, AskAboutTasksOutput } from '@/lib/ai-types';
import { z } from 'zod';
import { indexTasks, queryTasks } from '@/lib/vector-db/tasks-indexer';
import { buildWorkTimeStats, WorkSession } from '@/lib/helpers/time-analyzer';
import type { AppData, AppSettings, FixedCost, Quote, Task } from '@/lib/types'; // Add types for better error checking
import { ModelFallbackManager } from '@/ai/utils/gemini-models';
import { buildProductivityPrompt, type ProductivityContext } from '@/ai/prompts/productivity-prompt';
import { buildBusinessPrompt, type BusinessContext } from '@/ai/prompts/business-prompt';
import { GoogleGenAIService } from '@/ai/services/google-genai-service';
// SuggestQuoteInputSchema is defined locally below now



// --- Ask About Tasks Action (Real Implementation) ---
export async function askAboutTasksAction(input: AskAboutTasksInput): Promise<AskAboutTasksOutput> {
  try {
    // Validate required fields
    if (!input.apiKey) {
      throw new Error('API key is required');
    }
    if (!input.userInput || !input.userInput.trim()) {
      throw new Error('User input is required');
    }

    // Build conversation history in the format expected by chatWithAI
    const messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = [];

    // Add history messages
    if (input.history && input.history.length > 0) {
      for (const histMsg of input.history) {
        messages.push({
          role: histMsg.role === 'user' ? 'user' : 'assistant',
          content: Array.isArray(histMsg.content) ? histMsg.content.map(c => c.text).join(' ') : String(histMsg.content),
          timestamp: new Date()
        });
      }
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: input.userInput,
      timestamp: new Date()
    });

    // Call the AI service
    const response = await chatWithAI({
      messages,
      model: input.modelName || 'gemini-1.5-flash'
    });

    if (!response.success) {
      throw new Error(response.error || 'AI request failed');
    }

    return {
      text: response.message.content,
      action: null, // For now, no specific actions are parsed
      interactiveElements: [] // For now, no interactive elements
    };

  } catch (error: any) {
    console.error('askAboutTasksAction error:', error);
    throw new Error(error.message || 'Failed to process AI request');
  }
}

// --- Suggest Quote Action ---

const LocalSuggestQuoteInputSchema = z.object({
  taskDescription: z.string().min(5, "Task description is required."),
  taskCategory: z.string().optional(),
  currency: z.string().default('VND'),
  language: z.enum(['en', 'vi']).optional().default('vi'),
  apiKey: z.string().optional(),
  modelName: z.string().optional(),
});

type LocalSuggestQuoteInput = z.infer<typeof LocalSuggestQuoteInputSchema>;

export async function suggestQuoteAction(input: LocalSuggestQuoteInput): Promise<{
  success: boolean;
  suggestedItems?: Array<{ description: string; unitPrice: number }>;
  error?: string;
  raw?: string;
}> {
  try {
    const validation = LocalSuggestQuoteInputSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: "Invalid input: " + validation.error.message };
    }

    const { taskDescription, taskCategory, currency, language, apiKey, modelName } = validation.data;

    console.log(`💡 SuggestQuote: Start. Model: ${modelName || 'default'}, Currency: ${currency}, APIKey provided: ${!!apiKey}, Length: ${apiKey?.length || 0}`);

    // Build enhanced prompt
    const currencyGuidance = currency === 'VND'
      ? 'Giá trị đơn giá phải là số nguyên lớn phù hợp với thị trường Việt Nam (ví dụ: 500.000 - 20.000.000 VND).'
      : `Unit prices should be in ${currency}.`;

    const languageInstruction = language === 'vi'
      ? 'Mô tả các hạng mục bằng Tiếng Việt.'
      : 'Describe line items in English.';

    const prompt = `You are an expert Freelance project estimator.
    
**Task**: "${taskDescription}"
${taskCategory ? `**Category**: "${taskCategory}"` : ''}

**Requirements**:
1. ${languageInstruction}
2. Currency: **${currency}**. ${currencyGuidance}
3. Suggest 3-5 quote line items.
4. Output specific, realistic prices.

**Output JSON Format**:
{
  "suggestedItems": [
    { "description": "Item description", "unitPrice": 1000000 }
  ]
}`;

    const response = await GoogleGenAIService.generateJSON<{ suggestedItems: any[] }>(prompt, {
      apiKey, // User provided key takes precedence
      modelName,
      temperature: 0.7
    });

    if (!response.success || !response.data) {
      return { success: false, error: response.error, raw: response.raw };
    }

    return { success: true, suggestedItems: response.data.suggestedItems };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Analyze Productivity Action ---

const AnalyzeProductivityInputSchema = z.object({
  apiKey: z.string().optional(),
  modelName: z.string().optional(),
  context: z.any(), // Strictly typed in usage
  language: z.enum(['en', 'vi']).optional(),
  userParams: z.any().optional(),
  appDataSnapshot: z.any().optional(),
  customPrompt: z.string().optional(),
});

type AnalyzeProductivityInput = z.infer<typeof AnalyzeProductivityInputSchema>;

export async function analyzeProductivityAction(input: AnalyzeProductivityInput): Promise<{ success: boolean; insights?: any[]; raw?: string; error?: string }> {
  try {
    const parsed = AnalyzeProductivityInputSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'Invalid input.' };

    const { apiKey, modelName, context, language = 'en', userParams, appDataSnapshot, customPrompt } = parsed.data;

    // ... (Vector search logic remains same) ...
    // Note: To preserve lines, I will just reference the prompt building part below.

    // Load AppData for Vector Search if needed
    let appData: AppData | null = appDataSnapshot as AppData || null;

    let finalApiKey = apiKey;
    if (!finalApiKey) finalApiKey = process.env.GOOGLE_GENAI_API_KEY || '';
    if (!finalApiKey && appData) finalApiKey = appData.appSettings?.googleApiKey || '';

    const finalChatModel = ModelFallbackManager.getPreferredModel(modelName || appData?.appSettings?.googleModel);
    // (Embeddings logic omitted for brevity in search match, assuming it precedes this block)
    // Actually I need to match the text carefully. To avoid touching the huge vector search block, I will target the Schema definition and the Prompt definition separately.

    const finalEmbedModel = ModelFallbackManager.getPreferredModel(appData?.appSettings?.googleModel || 'text-embedding-004');

    let relevantVectorContext = '';
    const hasApiKeyForEmbeddings = !!finalApiKey && !!appData?.tasks;

    if (hasApiKeyForEmbeddings && appData) {
      try {
        // Quick vector search for similar context
        // Identify keywords from context (e.g., recent task names)
        const recentNames = context.recentCompleted?.map((t: any) => t.name).join(' ') || '';
        const riskCount = context.risks?.high || 0;
        const queryText = `Productivity challenges related to: ${recentNames}. Risk level: ${riskCount > 0 ? 'High' : 'Normal'}.`;

        await indexTasks(appData.tasks!, { apiKey: finalApiKey, model: finalEmbedModel });

        // Reload to be safe - skipping PouchDB reload
        const currentAppData = appData;

        const relatedDocs = await queryTasks(queryText, 3, { apiKey: finalApiKey, model: finalEmbedModel });

        if (relatedDocs && relatedDocs.length > 0) {
          relevantVectorContext = `\n\n--- SIMILAR PAST TASKS (Vector Search) ---\n` +
            relatedDocs.map(d => `- Task: "${d.text}" (Score: ${d.score.toFixed(2)})`).join('\n') +
            `\n--- END SIMILAR TASKS ---\n`;
        }
      } catch (e) {
        console.warn('Vector search failed for productivity:', e);
      }
    }

    // Prepare full context
    const proContext: ProductivityContext = {
      ...context,
      relevantVectorContext,
      userParams
    };

    const prompt = customPrompt || buildProductivityPrompt(proContext, language);

    const response = await GoogleGenAIService.generateJSON<any[]>(prompt, {
      apiKey: finalApiKey,
      modelName: finalChatModel,
      temperature: 0.7
    });

    if (!response.success) {
      return { success: false, error: response.error || 'AI request failed' };
    }

    // GoogleGenAIService already parses JSON
    let insights = response.data || [];
    if (!Array.isArray(insights)) {
      // Fallback if root is not array (e.g. wrapped in object)
      if ((insights as any).insights) insights = (insights as any).insights;
      else return { success: false, error: 'AI output format invalid', raw: response.raw };
    }

    return { success: true, insights, raw: response.raw };

  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

// --- AI Writing Assistant Action ---

const WritingAssistantInputSchema = z.object({
  baseText: z.string().min(10, "Base text is too short."),
  prompt: z.string().optional(),
  action: z.enum(['write', 'edit', 'reply', 'summarize', 'translate']),
  tone: z.enum(['formal', 'casual', 'professional', 'friendly']),
  length: z.enum(['short', 'medium', 'long']),
  outputLanguage: z.enum(['en', 'vi']),
  apiKey: z.string().min(1),
  modelName: z.string().min(1),
});

type WritingAssistantInput = z.infer<typeof WritingAssistantInputSchema>;

function buildFinalPrompt(params: WritingAssistantInput): string {
  const { baseText, prompt, tone, length, outputLanguage, action } = params;
  const targetLanguage = outputLanguage === 'vi' ? 'Vietnamese' : 'English';

  let mainTask = `Your main task is to perform the action "${action}" on the "Base Content".`;
  if (prompt) mainTask += `\nFollow these specific instructions: "${prompt}"`;

  let finalPrompt = `${mainTask}\n\n--- Base Content ---\n${baseText}\n\n--- AI INSTRUCTIONS ---`;
  finalPrompt += `\n- Tone: ${tone}.`;
  finalPrompt += `\n- Length: ${length}.`;
  finalPrompt += `\n- Language: Respond in ${targetLanguage}.`;
  finalPrompt += `\n- OUTPUT FORMAT: You MUST respond with a single, valid JSON object. Do not add any text before or after it. The JSON object must have two keys: "summaryTitle" (a short, 5-7 word summary of the original user's request in ${targetLanguage}) and "mainContent" (the full text result, formatted in Markdown if appropriate).`;

  return finalPrompt;
}

export async function writingAssistantAction(input: WritingAssistantInput): Promise<{ success: boolean; result?: { mainContent: string; summaryTitle: string; }; error?: string }> {
  try {
    const validation = WritingAssistantInputSchema.safeParse(input);
    if (!validation.success) { return { success: false, error: "Invalid input." }; }

    const prompt = buildFinalPrompt(validation.data);
    const result = await chatWithAI({
      messages: [{ role: 'user', content: prompt, timestamp: new Date() }],
      model: validation.data.modelName,
    });

    if (result.success) {
      try {
        // Find and parse the JSON object from the response string (take first match)
        const jsonString = result.message.content.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) throw new Error("No valid JSON object found in AI response.");
        const parsedResult = JSON.parse(jsonString);

        if (typeof parsedResult.mainContent === 'string' && typeof parsedResult.summaryTitle === 'string') {
          return { success: true, result: parsedResult };
        } else {
          throw new Error("JSON response is missing required keys ('mainContent', 'summaryTitle').");
        }
      } catch (e: any) {
        // If parsing fails, return the raw content as a fallback
        return { success: true, result: { mainContent: result.message.content, summaryTitle: "Untitled" } };
      }
    } else {
      return { success: false, error: result.error || 'AI error.' };
    }

  } catch (error: any) {
    return { success: false, error: error.message || 'Server error.' };
  }
}

// --- Analyze Business Action ---

const AnalyzeBusinessInputSchema = z.object({
  apiKey: z.string().optional(),
  modelName: z.string().optional(),
  rangeDays: z.number().int().positive().optional(),
  // includeDetails: z.boolean().optional(), // Removed as not used directly in this server action
  financialContext: z.any().optional(), // Added for detailed analysis
  language: z.enum(['en', 'vi']).optional(), // Add language to schema
  // Optional client-side snapshot fallback if server cannot access PouchDB
  appDataSnapshot: z.any().optional(),
});

type AnalyzeBusinessInput = z.infer<typeof AnalyzeBusinessInputSchema>;

export async function analyzeBusinessAction(input: AnalyzeBusinessInput): Promise<{ success: boolean; summary?: string; insights?: any[]; raw?: string; error?: string }> {
  try {
    const parsed = AnalyzeBusinessInputSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'Invalid input.' };
    // Destructure financialContext
    const { apiKey, modelName, rangeDays = 30, appDataSnapshot, financialContext, language = 'en' } = parsed.data; // DESTRUCTURING language here

    let appData: AppData | null = null;
    if (appDataSnapshot) { // PRIORITIZE SNAPSHOT
      appData = appDataSnapshot as AppData;
    } else { // FALLBACK REMOVED
      return { success: false, error: 'No data snapshot provided and local storage is disabled.' };
    }

    if (!appData) return { success: false, error: 'App data is not available.' };

    // Determine API key and model for AI chat AND embeddings
    // Priority: 1. Passed apiKey, 2. Environment variable, 3. appData settings
    let finalApiKey = apiKey;
    let apiKeySource = 'passed';
    if (!finalApiKey) {
      finalApiKey = process.env.GOOGLE_GENAI_API_KEY || '';
      apiKeySource = 'env';
    }
    if (!finalApiKey) {
      finalApiKey = appData?.appSettings?.googleApiKey || '';
      apiKeySource = 'appData';
    }

    console.log(`🔑 Business AI: Using API key from ${apiKeySource}, key exists: ${!!finalApiKey}, length: ${finalApiKey?.length || 0}`);
    console.log('📊 Business AI Context Payload:', JSON.stringify({
      periodLabel: financialContext?.periodLabel,
      revenue: financialContext?.revenue,
      costs: financialContext?.costs,
      costStructureLength: financialContext?.costStructure?.length,
      topCost: financialContext?.costStructure?.[0]
    }, null, 2));

    // Use ModelFallbackManager for chat model
    const finalChatModel = ModelFallbackManager.getPreferredModel(modelName || appData?.appSettings?.googleModel);
    // For embeddings, use preferred model from settings or a sensible default embedding model.
    const finalEmbedModel = ModelFallbackManager.getPreferredModel(appData?.appSettings?.googleModel || 'text-embedding-004'); // Assuming text-embedding-004 is a fallback embedding model, otherwise it needs to be fetched from an available Gemini model, like an embedded Flash version.

    const hasApiKeyForEmbeddings = !!finalApiKey;

    let relevantDocumentsContext = '';

    if (hasApiKeyForEmbeddings && appData.tasks) { // Proceed with embeddings if API key is available
      console.log('🤖 AI: Checking/generating embeddings for tasks...');
      try {
        // Index all current tasks to ensure embeddings exist. `indexTasks` internally checks for missing embeddings.
        await indexTasks(appData.tasks, { apiKey: finalApiKey, model: finalEmbedModel });

        // Reload appData skipped (PouchDB removed)

        console.log('🤖 AI: Performing vector search...');
        const queryText = `Financial analysis for ${financialContext?.summary?.profit > 0 ? 'profitability' : 'losses'} related to clients: ${financialContext?.breakdown?.map((b: any) => b.name).join(', ')}. Details: ${JSON.stringify(financialContext)}`;
        const relatedDocs = await queryTasks(queryText, 5, { apiKey: finalApiKey, model: finalEmbedModel });

        if (relatedDocs && relatedDocs.length > 0) {
          relevantDocumentsContext = `\n\n--- RELEVANT PROJECT DETAILS (from vector search) ---\n` +
            relatedDocs.map(d => `Task ID: ${d.id.replace('task:', '')}, Score: ${d.score.toFixed(3)}, Text: "${d.text}"`).join('\n') +
            `\n--- END RELEVANT DOCUMENTS ---`;
        }
        console.log(`🤖 AI: Found ${relatedDocs.length} relevant documents.`);
      } catch (embeddingError: any) {
        console.error('AI: Error during embedding generation or vector search, proceeding without contextual documents:', embeddingError.message);
        relevantDocumentsContext = `\n\n--- NOTE --- \n(Contextual documents could not be retrieved due to an error: ${embeddingError?.message || 'unknown error'}).`;
      }
    } else if (!hasApiKeyForEmbeddings) {
      console.warn('AI: No API key for embeddings, skipping vector search. Analysis will be based only on aggregated KPIs.');
      relevantDocumentsContext = '\n\n--- NOTE --- \n(Contextual documents were skipped due to missing API key).';
    }


    // Aggregate minimal KPIs (KISS): revenue, costs, netProfit, margin, topClients, costStructure, cashTrend
    // Using financialContext for key aggregates to simplify server-side logic and reuse client-side calculations
    // Aggregate minimal KPIs (KISS): revenue, costs, netProfit, margin, topClients, costStructure, cashTrend
    // Using financialContext for key aggregates to simplify server-side logic and reuse client-side calculations
    // FIXED: Access top-level properties from client-side context, checks for both structures for legacy support
    const revenue = financialContext?.revenue ?? financialContext?.summary?.revenue ?? 0;
    const costs = financialContext?.costs ?? financialContext?.summary?.costs ?? 0;
    const netProfit = financialContext?.netProfit ?? financialContext?.summary?.profit ?? 0;
    const marginPercent = revenue > 0 ? Math.round((netProfit / revenue) * 10000) / 100 : 0;

    // Top clients from financialContext.breakdown OR clientSideRevenueBreakdown
    const topClientsRaw = Array.isArray(financialContext?.clientSideRevenueBreakdown)
      ? financialContext.clientSideRevenueBreakdown
      : (Array.isArray(financialContext?.breakdown) ? financialContext.breakdown : []);

    const totalRevenue = revenue || 1;
    const topClients: Array<{ id: string; amt: number; name: string }> = topClientsRaw.map((c: { name: string; value: number }) => ({
      id: c.name,
      amt: c.value,
      name: c.name,
    }));
    topClients.sort((a: { amt: number }, b: { amt: number }) => b.amt - a.amt);
    const topClientsPct = topClients.slice(0, 3).map((c: { id: string; amt: number; name: string }) => ({ ...c, pct: Math.round((c.amt / totalRevenue) * 10000) / 100 }));

    // Cost structure by category (from expenses and fixed costs) - still aggregate server-side but fixed fixedCosts.type issue
    // Using the 'appData' (either from snapshot or PouchDB load) directly now
    // Cost structure: Use financialContext if available to respect date filters
    let costStructure: any[] = [];
    if (financialContext?.costStructure && Array.isArray(financialContext.costStructure)) {
      costStructure = financialContext.costStructure;
    } else {
      // Fallback: Calculate from all appData (Warning: This ignores date filters)
      const expenses = Array.isArray(appData.expenses) ? appData.expenses : [];
      const fixedCosts = Array.isArray(appData.fixedCosts) ? appData.fixedCosts : [];
      const costMap = new Map<string, number>();
      const currentCostSum = (expenses.reduce((s: number, e: { amount: number }) => s + (Number(e.amount) || 0), 0) + fixedCosts.reduce((s: number, f: FixedCost) => s + (Number(f.amount) || 0), 0));

      for (const e of expenses) {
        const cat = e?.category || 'Other';
        costMap.set(cat, (costMap.get(cat) || 0) + (Number(e.amount) || 0));
      }
      for (const f of fixedCosts) {
        const cat = f?.name || 'Fixed';
        costMap.set(cat, (costMap.get(cat) || 0) + (Number(f.amount) || 0));
      }
      costStructure = Array.from(costMap.entries()).map(([k, v]) => ({ category: k, amount: v, pct: Math.round((v / (currentCostSum || 1)) * 10000) / 100 }));
    }


    // Cash trend: naive compare revenue last period vs this period - adapted for financialContext data where possible, or kept simpler
    // This part requires original `quotes` with `createdAt`, which we decided to skip for now.
    // So, this is a simplified calculation: just use 'flat' for now if we can't reliably calculate trend.
    // Or, remove for now and explicitly mention it. Given this is optional and problematic, simplifying it to rely less on deep historical raw data here.
    const cashTrendSign = (financialContext?.summary?.profitTrend || 'flat'); // Placeholder/simplified


    // Pareto detection - Fixed
    const top1Item = topClients.length > 0 ? topClients[0] : null; // FIXED
    const top1Pct = top1Item ? Math.round((top1Item.amt / totalRevenue) * 10000) / 100 : 0;
    const top3Total = topClientsPct.slice(0, 3).reduce((s: number, a: { amt: number }) => s + (a.amt || 0), 0); // FIXED type here
    const top3Pct = Math.round((top3Total / totalRevenue) * 10000) / 100;
    const alerts: any[] = [];
    if (top1Pct >= 50) alerts.push({ id: 'pareto-top1', type: 'pareto', severity: 'high', message: `${top1Pct}% revenue from ${top1Item?.name || 'a single client'}` });
    else if (top3Pct >= 80) alerts.push({ id: 'pareto-top3', type: 'pareto', severity: 'medium', message: `Top 3 clients contribute ${top3Pct}% of revenue` });

    // Build a compact context JSON to send to AI (keep minimal)
    const context: BusinessContext = {
      periodDays: financialContext?.periodDays || rangeDays || 30, // Use context days if available
      periodLabel: financialContext?.periodLabel, // Add label from context
      revenue: Math.round(revenue * 100) / 100,
      costs: Math.round(costs * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      marginPercent,
      topClients: topClientsPct.map((c: { name: string; pct: number; amt: number }) => ({ name: c.name, pct: c.pct, amount: Math.round(c.amt * 100) / 100 })),
      costStructure: costStructure.slice(0, 6),
      alerts,
      cashTrendSign,
      clientSideFinancialSummary: financialContext?.summary,
      clientSideRevenueBreakdown: financialContext?.breakdown,
      relevantVectorContext: relevantDocumentsContext,
      currency: financialContext?.currency || 'USD'
    };

    // Use centralized prompt builder
    const finalPrompt = buildBusinessPrompt(context, language);

    // Call chatWithAI with the augmented prompt
    // Call GoogleGenAIService
    const response = await GoogleGenAIService.generateJSON<{ summary?: string; insights?: any[] }>(finalPrompt, {
      apiKey: finalApiKey,
      modelName: finalChatModel,
      temperature: 0.7
    });

    if (!response.success) return { success: false, error: response.error || 'AI call failed', raw: response.raw };

    const parsedResponse = response.data || {};
    return { success: true, summary: parsedResponse.summary, insights: parsedResponse.insights, raw: response.raw };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server error' };
  }
}
