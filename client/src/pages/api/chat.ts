import { type Request, type Response } from 'express';
import { sendMessageToHuggingFace, type Message } from '@/services/huggingface';

// Handle Hugging Face API requests
const handleHuggingFaceRequest = async (messages: Message[]): Promise<string> => {
  try {
    return await sendMessageToHuggingFace(messages);
  } catch (error) {
    console.error('Error in Hugging Face API:', error);
    throw error;
  }
};

interface ApiRequest {
  method: string;
  body: {
    messages?: Message[];
    [key: string]: any;
  };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
}

export default async function handler(
  req: Request,
  res: Response
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Process with Hugging Face
    const response = await handleHuggingFaceRequest(messages);
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 