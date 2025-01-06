// src/services/openai.ts
interface OpenAIResponse {
  response: string;
  error?: string;
}

export const generateAIResponse = async (prompt: string): Promise<OpenAIResponse> => {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return {
      response: 'Error generating response. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};