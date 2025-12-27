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

  // Build currency-specific guidance
  let currencyGuidance = `All monetary values are in ${currency}.`;
  if (currency === 'VND') {
    currencyGuidance = `
CRITICAL CURRENCY GUIDANCE (VND - Vietnamese Dong):
- All monetary values are in VND (Vietnamese Dong).
- VND uses full numeric notation WITHOUT abbreviations. Read numbers carefully:
  * 1,000,000 VND = 1 million VND (một triệu đồng)
  * 100,000,000 VND = 100 million VND (một trăm triệu đồng)
  * 1,000,000,000 VND = 1 billion VND (một tỷ đồng)
- EXAMPLE: If revenue = 150000000, that means 150 million VND (một trăm năm mươi triệu đồng), NOT 150 billion.
- When mentioning amounts, always include the unit clearly (e.g., "150 triệu VND" or "150 million VND").
- DO NOT convert to USD or other currencies.`;
  } else if (currency !== 'USD') {
    currencyGuidance = `All monetary values are in ${currency}. When mentioning amounts, always include the currency symbol or code.`;
  }

  // Format key amounts for reference
  const formattedRevenue = context.revenue.toLocaleString('en-US');
  const formattedCosts = context.costs.toLocaleString('en-US');
  const formattedProfit = context.netProfit.toLocaleString('en-US');

  return `You are a Fractional CFO (Chief Financial Officer) for a freelance business. 
CONTEXT_JSON = ${JSON.stringify(context)}

${currencyGuidance}

KEY FINANCIAL FIGURES (for reference):
- Revenue: ${formattedRevenue} ${currency}
- Costs: ${formattedCosts} ${currency}
- Net Profit: ${formattedProfit} ${currency}
- Margin: ${context.marginPercent}%

INSTRUCTIONS:
1. Analyze the financial health over the ${periodDesc} based on Revenue, Profit, Margin, and Client Concentration.
2. Incorporate "relevantVectorContext" if available to reference specific past projects or costs.
3. Generate exactly 3 highly strategic insights. Each insight must be a JSON object:
    - category: 'Risk', 'Opportunity', 'Optimization', or 'Growth'.
    - severity: 'low', 'medium', 'high'.
    - insight: A sharp financial observation.
    - suggestion: A direct, profitable action (e.g., "Increase rates for Client X", "Cut subscription Y").
    - justification: A short data-backed reason (e.g., "Client X accounts for 60% of revenue").
4. Generate a "summary" field: A structured executive summary (2-3 sentences) of the overall financial period. Mention relevant amounts with correct magnitude in ${currency}.
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
