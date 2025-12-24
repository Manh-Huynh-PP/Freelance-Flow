export interface ProductivityContext {
    tasksCount: number;
    workTime: {
        totalWorkHours: number | null;
        totalFocusHours: number | null;
        focusRatio: string | null;
        pomodoros: number;
        daily: any[];
    } | null;
    taskAnalytics: {
        pie: any[];
        totalNew: number;
        avgPerDay: string;
        range: { from: string; to: string } | null;
        summary: any;
        groupBy: string;
    } | null;
    risks: {
        high: number;
        medium: number;
    } | null;
    recentCompleted: { id: string; name: string }[];
    relevantVectorContext?: string;
    userParams?: {
        deadlineMetrics?: any;
        patterns?: any;
    };
    workTimeRange?: { from: string; to: string } | null;
}

export const buildProductivityPrompt = (context: ProductivityContext, language: 'en' | 'vi' = 'en') => {
    const responseLanguage = language === 'vi' ? 'Vietnamese' : 'English';

    return `You are a senior productivity & workflow analyst AI.
CONTEXT_JSON = ${JSON.stringify(context)}

INSTRUCTIONS:
1. Analyze the provided CONTEXT_JSON. Note that 'taskAnalytics' and 'workTime' may cover different date ranges (see 'workTimeRange' and 'taskAnalytics.range').
2. Focus on work habits, task completion, and focus time.
2. If "relevantVectorContext" is present, use it to identify recurring challenges or similar past tasks.
3. Derive 3-5 distinct insights. Each insight must have:
    - category: 'Productivity', 'Time Management', 'Risk', 'Habit', or 'Wellness'.
    - severity: 'low', 'medium', 'high', or 'critical'.
    - insight: A concise observation (max 20 words).
    - suggestion: An actionable, imperative recommendation (e.g., "Schedule deep work blocks at 10 AM").
4. Rules for Severity:
    - Focus Ratio < 0.3 -> High/Critical severity (Distracted).
    - High Risk Tasks > 0 -> High/Critical severity.
    - Consistent daily work -> Low/Positive severity (Habit).
5. Language: Respond strictly in ${responseLanguage}.

OUTPUT FORMAT:
Return ONLY a valid JSON array of objects. No markdown, no preambles.
Example: [{"category":"Time Management","severity":"high","insight":"Focus time is only 20% of work hours.","suggestion":"Enable Focus Mode for 2 hours daily."}]`;
};
