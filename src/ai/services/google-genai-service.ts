import { GoogleGenAI } from "@google/genai";
import { GeminiModel, ModelFallbackManager } from '../utils/gemini-models';

interface GenerationOptions {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
    responseMimeType?: string;
    responseSchema?: any;
}

interface GenAIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    raw?: string;
    modelUsed?: string;
}

export class GoogleGenAIService {
    private static getApiKeys(): string[] {
        const keys: string[] = [];

        // Priority 1: Primary Env Key
        if (process.env.GOOGLE_GENAI_API_KEY) {
            keys.push(process.env.GOOGLE_GENAI_API_KEY);
        }

        // Priority 2: Backup Env Key
        if (process.env.GOOGLE_GENAI_API_KEY_BACKUP) {
            keys.push(process.env.GOOGLE_GENAI_API_KEY_BACKUP);
        }

        return keys;
    }

    /**
     * Execute a generation request with automatic key rotation and model fallback
     */
    static async generateJSON<T>(
        prompt: string,
        options: {
            modelName?: string;
            apiKey?: string; // Optional user-provided key (highest priority)
            temperature?: number;
            schema?: any; // Optional JSON schema
        } = {}
    ): Promise<GenAIResponse<T>> {
        // 1. Determine Keys to use
        let keysToTry = this.getApiKeys();
        if (options.apiKey) {
            // User provided key goes first
            keysToTry = [options.apiKey, ...keysToTry];
        }

        // De-duplicate keys
        keysToTry = Array.from(new Set(keysToTry)).filter(k => !!k);



        if (keysToTry.length === 0) {
            return { success: false, error: 'No API keys configured.' };
        }

        // 2. Determine Model Chain
        const preferredModel = ModelFallbackManager.getPreferredModel(options.modelName);
        const modelChain = ModelFallbackManager.getFallbackChain(preferredModel);

        // 3. Try each key, then each model
        let lastError: any = null;

        // Strategy: Try preferred model with all keys first (to keep quality high).
        // If that fails, downgrade model and try all keys again?
        // OR: Fix Key -> Try all models -> Fail -> Switch Key -> Try all models. 
        // Key rotation is usually for Quota/Rate limits. Model fallback is for overloaded/503.

        // Let's do: Key Rotation -> Model Fallback.
        // Actually, if a key is rate limited, switching model might not help if it's account-wide.
        // But if model is overloaded (503), switching model helps.

        // Better Strategy:
        // Outer Loop: Keys
        // Inner Loop: Models (only if error is NOT auth/quota related?)

        for (const apiKey of keysToTry) {
            const client = new GoogleGenAI({ apiKey });

            for (const model of modelChain) {
                try {


                    const response = await client.models.generateContent({
                        model: model,
                        contents: prompt,
                        config: {
                            temperature: options.temperature || 0.7,
                            responseMimeType: 'application/json',
                            responseSchema: options.schema,
                        }
                    });

                    const text = response.text;
                    if (!text) throw new Error('Empty response from AI');

                    let data: T;

                    try {
                        data = JSON.parse(text) as T;
                    } catch (e) {
                        // If already JSON object (SDK might parse automatically if schema provided?)
                        // verify response.text() returns string JSON.
                        data = JSON.parse(text) as T;
                    }

                    return {
                        success: true,
                        data,
                        raw: text,
                        modelUsed: model
                    };

                } catch (error: any) {
                    lastError = error;
                    const msg = error.message || '';
                    const status = error.status || error.response?.status;
                    console.warn(`❌ GenAI Error (${model}):`, msg, status ? `Status: ${status}` : '');

                    // Analyze Error Type
                    const isQuota = msg.includes('429') || status === 429 || msg.includes('quota') || msg.includes('Resource has been exhausted');
                    const isAuth = msg.includes('401') || status === 401 || msg.includes('API key');

                    if (isAuth || isQuota) {
                        // Break Inner Loop (Models) -> Go to Next Key
                        console.warn(`⚠️ Key exhausted/invalid (Status: ${status}). Switching key...`);
                        break; // Break inner loop, try next key
                    }

                    // If 503/Overloaded, continue inner loop (Try next model with same key)
                }
            }
        }

        return {
            success: false,
            error: lastError?.message || 'All AI attempts failed.',
            raw: JSON.stringify(lastError)
        };
    }
}
