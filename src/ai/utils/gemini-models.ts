/**
 * Gemini Model Configuration and Fallback System
 * Supports Gemini 2.0 Flash Exp with automatic fallback to 1.5 models
 */

export enum GeminiModel {
  // Gemini 3.0 (Advanced)
  GEMINI_3_0_PRO = 'gemini-3.0-pro',

  // Gemini 2.5 (Standard / Production)
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite',

  // Legacy / Experimental
  GEMINI_2_0_FLASH_EXP = 'gemini-2.0-flash-exp',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  GEMINI_1_5_FLASH_8B = 'gemini-1.5-flash-8b'
}

export interface ModelConfig {
  name: GeminiModel;
  displayName: string;
  category: '3.0' | '2.5' | '2.0' | '1.5';
  capabilities: {
    maxTokens: number;
    inputCost: number; // per 1M tokens
    outputCost: number; // per 1M tokens
    rateLimit: number; // requests per minute (if applicable)
  };
  description?: string; // New field for model description
  fallbackModel?: GeminiModel;
}

export const GEMINI_MODELS: Record<GeminiModel, ModelConfig> = {
  [GeminiModel.GEMINI_3_0_PRO]: {
    name: GeminiModel.GEMINI_3_0_PRO,
    displayName: 'Gemini 3.0 Pro',
    category: '3.0',
    capabilities: {
      maxTokens: 2000000, // contextWindow
      inputCost: 1.25, // 0.00000125 per token * 1,000,000
      outputCost: 3.75, // 0.00000375 per token * 1,000,000
      rateLimit: 60 // Placeholder, adjust as needed
    },
    description: 'Best performing multimodal model with advanced reasoning.',
    fallbackModel: GeminiModel.GEMINI_2_5_FLASH
  },
  [GeminiModel.GEMINI_2_5_FLASH]: {
    name: GeminiModel.GEMINI_2_5_FLASH,
    displayName: 'Gemini 2.5 Flash',
    category: '2.5',
    capabilities: {
      maxTokens: 1000000, // contextWindow
      inputCost: 0.10, // 0.0000001 per token * 1,000,000
      outputCost: 0.40, // 0.0000004 per token * 1,000,000
      rateLimit: 120 // Placeholder, adjust as needed
    },
    description: 'Best price-performance, low latency.',
    fallbackModel: GeminiModel.GEMINI_2_5_FLASH_LITE
  },
  [GeminiModel.GEMINI_2_5_FLASH_LITE]: {
    name: GeminiModel.GEMINI_2_5_FLASH_LITE,
    displayName: 'Gemini 2.5 Flash Lite',
    category: '2.5',
    capabilities: {
      maxTokens: 1000000, // contextWindow
      inputCost: 0.05, // 0.00000005 per token * 1,000,000
      outputCost: 0.20, // 0.0000002 per token * 1,000,000
      rateLimit: 120 // Placeholder, adjust as needed
    },
    description: 'Fastest and most cost-effective.',
    fallbackModel: GeminiModel.GEMINI_2_0_FLASH_EXP
  },
  [GeminiModel.GEMINI_2_0_FLASH_EXP]: {
    name: GeminiModel.GEMINI_2_0_FLASH_EXP,
    displayName: 'Gemini 2.0 Flash Exp',
    category: '2.0',
    capabilities: {
      maxTokens: 8192, // Likely higher in 2.0 but stick to safe 8k for UI
      inputCost: 0, // Free tier
      outputCost: 0,
      rateLimit: 15 // 1500 RPD verified for Exp
    },
    fallbackModel: GeminiModel.GEMINI_1_5_FLASH_8B
  },

  [GeminiModel.GEMINI_1_5_PRO]: {
    name: GeminiModel.GEMINI_1_5_PRO,
    displayName: 'Gemini 1.5 Pro',
    category: '1.5',
    capabilities: {
      maxTokens: 8192,
      inputCost: 1.25,
      outputCost: 5.00,
      rateLimit: 2 // 2 RPM / 50 RPD (Tight)
    },
    fallbackModel: GeminiModel.GEMINI_2_5_FLASH
  },

  [GeminiModel.GEMINI_1_5_FLASH]: {
    name: GeminiModel.GEMINI_1_5_FLASH,
    displayName: 'Gemini 1.5 Flash',
    category: '1.5',
    capabilities: {
      maxTokens: 8192,
      inputCost: 0.075,
      outputCost: 0.30,
      rateLimit: 15 // REPORTED REDUCED TO 20-50 RPD in Dec 2025?? Keeping 15RPM config but moved to fallback.
    },
    fallbackModel: GeminiModel.GEMINI_2_5_FLASH
  },

  [GeminiModel.GEMINI_1_5_FLASH_8B]: {
    name: GeminiModel.GEMINI_1_5_FLASH_8B,
    displayName: 'Gemini 1.5 Flash 8B',
    category: '1.5',
    capabilities: {
      maxTokens: 8192,
      inputCost: 0.0375,
      outputCost: 0.15,
      rateLimit: 15 // 8B usually solid
    }
  }
};

export class ModelFallbackManager {
  private static readonly DEFAULT_MODEL = GeminiModel.GEMINI_2_5_FLASH;
  private static readonly FALLBACK_CHAIN = [
    GeminiModel.GEMINI_2_5_FLASH,
    GeminiModel.GEMINI_2_5_FLASH_LITE,
    GeminiModel.GEMINI_1_5_FLASH,
    GeminiModel.GEMINI_2_0_FLASH_EXP
  ];

  /**
   * Get the preferred model from user settings - ALWAYS prioritize user choice
   */
  static getPreferredModel(userPreference?: string): GeminiModel {
    // PRIORITY 1: User's explicit choice in settings
    if (userPreference) {
      // Check if it's a valid 3.0 model name
      if (userPreference === 'gemini-3.0-pro' || userPreference === GeminiModel.GEMINI_3_0_PRO) {
        return GeminiModel.GEMINI_3_0_PRO;
      }

      // Check if it's a valid 2.5 model name
      if (userPreference === 'gemini-2.5-flash' || userPreference === GeminiModel.GEMINI_2_5_FLASH) {
        return GeminiModel.GEMINI_2_5_FLASH;
      }
      if (userPreference === 'gemini-2.5-flash-lite' || userPreference === GeminiModel.GEMINI_2_5_FLASH_LITE) {
        return GeminiModel.GEMINI_2_5_FLASH_LITE;
      }

      // Check if it's a valid 2.0 model name
      if (userPreference === 'gemini-2.0-flash-exp' || userPreference === GeminiModel.GEMINI_2_0_FLASH_EXP) {
        return GeminiModel.GEMINI_2_0_FLASH_EXP;
      }

      // Check if it's a valid 1.5 model name  
      if (userPreference === 'gemini-1.5-pro' || userPreference === GeminiModel.GEMINI_1_5_PRO) {
        return GeminiModel.GEMINI_1_5_PRO;
      }
      if (userPreference === 'gemini-1.5-flash' || userPreference === GeminiModel.GEMINI_1_5_FLASH) {
        return GeminiModel.GEMINI_1_5_FLASH;
      }

      // Legacy support for old format
      if (userPreference.includes('1.5')) {
        // Auto-migrate 1.5 preferences to 2.5
        console.log('🔄 Auto-migrating 1.5 preference to 2.5');
        if (userPreference.includes('lite')) return GeminiModel.GEMINI_2_5_FLASH_LITE;
        return GeminiModel.GEMINI_2_5_FLASH;
      }
      // Legacy 2.0
      if (userPreference.includes('2.0')) {
        return GeminiModel.GEMINI_2_0_FLASH_EXP;
      }

      // If user preference is valid enum value
      if (Object.values(GeminiModel).includes(userPreference as GeminiModel)) {
        console.log(`✅ Using user's preferred model: ${userPreference}`);
        return userPreference as GeminiModel;
      }

      console.warn(`⚠️ Invalid user model preference: ${userPreference}, falling back to default`);
    }

    // PRIORITY 2: System default (only if no user preference)
    console.log(`🔧 Using system default model: ${this.DEFAULT_MODEL}`);
    return this.DEFAULT_MODEL;
  }

  /**
   * Get fallback chain starting from a specific model
   */
  static getFallbackChain(startModel: GeminiModel): GeminiModel[] {
    const config = GEMINI_MODELS[startModel];
    // Return custom chain if needed, or derived from standard
    if (startModel === GeminiModel.GEMINI_3_0_PRO) {
      return [GeminiModel.GEMINI_3_0_PRO, GeminiModel.GEMINI_2_5_FLASH, GeminiModel.GEMINI_2_5_FLASH_LITE];
    }
    const chain: GeminiModel[] = [startModel];

    let currentModel: GeminiModel = startModel;
    while (GEMINI_MODELS[currentModel]?.fallbackModel) {
      const fallback: GeminiModel = GEMINI_MODELS[currentModel].fallbackModel!;
      // Avoid infinite loops
      if (chain.includes(fallback)) break;

      chain.push(fallback);
      currentModel = fallback;
    }

    return chain;
  }

  /**
   * Get all available Modern models (2.0+)
   */
  static get20Models(): ModelConfig[] {
    return Object.values(GEMINI_MODELS).filter(model =>
      model.category === '2.0' || model.category === '2.5' || model.category === '3.0'
    );
  }

  /**
   * Get all available 1.5 models (fallback models)
   */
  static get15Models(): ModelConfig[] {
    return Object.values(GEMINI_MODELS).filter(model => model.category === '1.5');
  }

  /**
   * Check if a model is a modern generation model (2.0+)
   */
  static is20Model(model: GeminiModel): boolean {
    const category = GEMINI_MODELS[model].category;
    return category === '2.0' || category === '2.5' || category === '3.0';
  }

  /**
   * Get model configuration
   */
  static getModelConfig(model: GeminiModel): ModelConfig {
    return GEMINI_MODELS[model];
  }

  /**
   * Get cost estimate for a request
   */
  static estimateCost(model: GeminiModel, inputTokens: number, outputTokens: number): number {
    const config = GEMINI_MODELS[model];
    const inputCost = (inputTokens / 1_000_000) * config.capabilities.inputCost;
    const outputCost = (outputTokens / 1_000_000) * config.capabilities.outputCost;
    return inputCost + outputCost;
  }
}
