/**
 * Robust JSON Parser for AI Responses
 * Handles malformed JSON from AI models with multiple fallback strategies
 */

/**
 * Attempts to parse potentially malformed JSON string from AI responses.
 * Applies multiple fix strategies in sequence until one succeeds.
 * 
 * @param text - Raw AI response text that may contain JSON
 * @returns Parsed JSON object/array or null if all strategies fail
 */
export function parseAIResponseJSON<T = any>(text: string): T | null {
    if (!text || typeof text !== 'string') return null;

    let cleaned = text.trim();

    // Step 1: Remove markdown code fences
    cleaned = cleaned
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

    // Step 2: Normalize smart quotes to regular quotes
    cleaned = cleaned
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');

    // Step 3: Try direct parse
    try {
        return JSON.parse(cleaned) as T;
    } catch { }

    // Step 4: Try to extract JSON object {...} or array [...]
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');

    // Determine if it's an object or array
    let jsonCandidate = '';
    if (firstBracket !== -1 && lastBracket !== -1 &&
        (firstBrace === -1 || firstBracket < firstBrace)) {
        // Array detected first
        jsonCandidate = cleaned.substring(firstBracket, lastBracket + 1);
    } else if (firstBrace !== -1 && lastBrace !== -1) {
        // Object detected
        jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
    }

    if (jsonCandidate) {
        // Try parsing the extracted candidate
        try {
            return JSON.parse(jsonCandidate) as T;
        } catch { }

        // Step 5: Apply common fixes
        let fixed = jsonCandidate;

        // Fix trailing commas before closing brackets
        fixed = fixed.replace(/,\s*([}\]])/g, '$1');

        // Fix single quotes around keys: 'key': -> "key":
        fixed = fixed.replace(/(\s*?)'(\w+)'(\s*?):/g, '$1"$2"$3:');

        // Fix unquoted string values after colon (risky, may break valid content)
        // Only apply if previous strategies fail
        try {
            return JSON.parse(fixed) as T;
        } catch { }

        // Step 6: Try to fix broken string escapes
        fixed = fixed.replace(/\\'/g, "'");
        fixed = fixed.replace(/(?<!\\)\\([^"\\nrtbfu])/g, '$1'); // Remove invalid escapes

        try {
            return JSON.parse(fixed) as T;
        } catch { }

        // Step 7: Last resort - try to manually repair common issues
        // Remove newlines inside strings
        try {
            // This is aggressive - only use as last resort
            const lines = fixed.split('\n');
            const singleLine = lines.join(' ').replace(/\s+/g, ' ');
            return JSON.parse(singleLine) as T;
        } catch { }
    }

    console.warn('[parseAIResponseJSON] All JSON parsing strategies failed');
    return null;
}

/**
 * Extract and validate an array of structured insights from AI response
 */
export function parseStructuredInsights<T extends { category: string; severity: string; insight: string; suggestion: string }>(
    text: string
): T[] {
    const parsed = parseAIResponseJSON<T[]>(text);

    if (!Array.isArray(parsed)) {
        // Try to extract from object wrapper
        if (parsed && typeof parsed === 'object') {
            const maybeArray = (parsed as any).insights || (parsed as any).data || (parsed as any).results;
            if (Array.isArray(maybeArray)) {
                return maybeArray.filter(isValidInsight) as T[];
            }
        }
        return [];
    }

    // Validate structure
    return parsed.filter(isValidInsight) as T[];
}

function isValidInsight(item: any): boolean {
    return item &&
        typeof item.category === 'string' &&
        typeof item.severity === 'string' &&
        typeof item.insight === 'string' &&
        typeof item.suggestion === 'string';
}

/**
 * Extract business analysis result from AI response
 */
export function parseBusinessAnalysis(text: string): {
    summary: string;
    recommendations: string[];
    insights: any[];
    raw: string;
} | null {
    const parsed = parseAIResponseJSON<any>(text);

    if (!parsed) return null;

    return {
        summary: parsed.summary || parsed.overview || 'Analysis complete',
        recommendations: Array.isArray(parsed.recommendations)
            ? parsed.recommendations
            : (parsed.insights?.map((i: any) => i.suggestion) || []),
        insights: Array.isArray(parsed.insights) ? parsed.insights : [],
        raw: text
    };
}
