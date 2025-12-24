// Re-export types and proxy client for backward compatibility
export { 
  type ChatMessage, 
  type ChatRequest, 
  type ChatResponse, 
  type LegacyChatRequest,
  chatWithAI 
} from '@/ai/proxy-client';

// Legacy wrapper for backward compatibility with existing code that passes apiKey and modelName
// The new proxy handles API key server-side, so we ignore the passed apiKey
export async function chatWithAILegacy(request: import('@/ai/proxy-client').LegacyChatRequest): Promise<import('@/ai/proxy-client').ChatResponse> {
  const { chatWithAI } = await import('@/ai/proxy-client');
  return chatWithAI({
    messages: request.messages,
    model: request.modelName,
  });
}
