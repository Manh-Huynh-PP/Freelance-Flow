export interface BusinessContext {
  periodDays: number;
  periodLabel?: string;
  revenue: number;
  costs: number;
  netProfit: number;
  marginPercent: number;
  topClients: { name: string; pct: number; amount: number }[];
  costStructure: { category: string; amount: number; pct: number }[];
  alerts: any[];
  cashTrendSign: string;
  relevantVectorContext?: string;
  clientSideFinancialSummary?: any;
  clientSideRevenueBreakdown?: any;
  currency?: string; // Added currency field
}

export const buildBusinessPrompt = (context: BusinessContext, language: 'en' | 'vi' = 'en') => {
  const targetLanguageName = language === 'vi' ? 'Vietnamese' : 'English';
  const periodDesc = context.periodLabel || `${context.periodDays} days`;
  const currency = context.currency || 'USD';

  return `You are a Fractional CFO (Chief Financial Officer) for a freelance business. 
CONTEXT_JSON = ${JSON.stringify(context)}

INSTRUCTIONS:
1. Analyze the financial health over the ${periodDesc} based on Revenue, Profit, Margin, and Client Concentration. All monetary values are in ${currency}.
2. Incorporate "relevantVectorContext" if available to reference specific past projects or costs.
3. Generate exactly 3 highly strategic insights. Each insight must be a JSON object:
    - category: 'Risk', 'Opportunity', 'Optimization', or 'Growth'.
    - severity: 'low', 'medium', 'high'.
    - insight: A sharp financial observation.
    - suggestion: A direct, profitable action (e.g., "Increase rates for Client X", "Cut subscription Y").
    - justification: A short data-backed reason (e.g., "Client X accounts for 60% of revenue").
4. Generate a "summary" field: A structured executive summary (2-3 sentences) of the overall financial period. Mention relevant amounts in ${currency}.
5. Language: Respond strictly in ${targetLanguageName}.

OUTPUT FORMAT:
Return ONLY a valid JSON object with keys:
{
  "summary": "...",
  "insights": [
    { "category": "...", "severity": "...", "insight": "...", "suggestion": "...", "justification": "..." }
  ]
}`;
};
