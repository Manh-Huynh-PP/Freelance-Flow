// Client wrapper for server-side AI proxy
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string; // optional override
}

export interface ChatResponse {
  message: ChatMessage;
  success: boolean;
  error?: string;
}

// Legacy interface for backward compatibility
export interface LegacyChatRequest {
  messages: ChatMessage[];
  apiKey: string;
  modelName: string;
}

export async function chatWithAI(request: ChatRequest): Promise<ChatResponse> {
  try {
    const lastMessage = request.messages[request.messages.length - 1];
    if (!lastMessage) {
      throw new Error('No messages provided');
    }

    // Build absolute URL for server actions
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3003';

    // Get Session Token (Client-side)
    let token = '';
    try {
      // Dynamic import to avoid SSR issues if this runs on server (though proxy-client is mostly client-side usage)
      const { auth } = await import('@/lib/supabase-auth');
      const session = await auth.getSession();
      token = session.data?.access_token || '';
    } catch (e) {
      console.warn('Failed to get auth token for AI proxy:', e);
    }

    // Transform messages to Gemini format
    const geminiMessages = request.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`${baseUrl}/api/ai/proxy`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        messages: geminiMessages, // Send formatted messages
        model: request.model,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI proxy error: ${response.status} ${error}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.data?.candidates?.[0]?.content?.parts?.[0]?.text || // Fallback for old structure
      'No response from AI';

    return {
      message: {
        role: 'assistant',
        content: aiText,
        timestamp: new Date(),
      },
      success: true,
    };
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error('AI Proxy Error:', errorMessage);

    let friendlyError = `Xin lỗi, đã có lỗi xảy ra với AI: ${errorMessage}`;

    if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
      friendlyError = "Hệ thống AI đang quá tải (Rate Limit). Vui lòng thử lại sau 1-2 phút.";
    } else if (errorMessage.includes('All models failed') || errorMessage.includes('503')) {
      friendlyError = "Máy chủ AI đang bận. Vui lòng thử lại sau giây lát.";
    }

    return {
      message: {
        role: 'assistant',
        content: friendlyError,
        timestamp: new Date(),
      },
      success: false,
      error: errorMessage,
    };
  }
}