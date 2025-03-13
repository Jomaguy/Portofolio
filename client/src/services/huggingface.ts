import { HfInference } from '@huggingface/inference';

// Define message interface
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Simple in-memory cache for responses
type CacheEntry = {
  response: string;
  timestamp: number;
};

const responseCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const COOLDOWN_PERIOD = 5 * 1000; // 5 seconds cooldown between requests

// Track the last request time to enforce cooldown
let lastRequestTime = 0;

// Initialize the Hugging Face Inference client
const initHuggingFace = () => {
  // Use environment variable or fallback to empty string (will be caught and handled)
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
  
  if (!apiKey) {
    console.warn('Hugging Face API key is not set. Albert will not function properly.');
    return null;
  }
  
  return new HfInference(apiKey);
};

// Format messages for text generation
const formatMessagesForHuggingFace = (messages: Message[]): string => {
  // Extract system message if present
  const systemMessage = messages.find(m => m.role === 'system');
  
  // Format conversation history using Mistral's chat template
  let prompt = '';
  
  // Add system message as instructions if present
  if (systemMessage) {
    // Use Mistral's format for system instructions
    prompt += `<s>[INST] System: ${systemMessage.content} [/INST]</s>\n\n`;
  }
  
  // Add conversation history - we'll use a single instruction block with the full conversation
  // This helps the model understand it's a continuing conversation
  const chatMessages = messages.filter(m => m.role !== 'system');
  
  // Start a conversation block
  prompt += '<s>[INST]\n';
  
  // Add a conversation prefix to help the model understand this is a continuing conversation
  prompt += 'This is a continuing conversation with the user. Maintain context from previous messages. ';
  prompt += 'Do not introduce yourself again if you have already done so. ';
  prompt += 'Respond directly to the user\'s most recent query.\n\n';
  
  // Add the conversation history
  prompt += 'Conversation history:\n';
  for (let i = 0; i < chatMessages.length; i++) {
    const message = chatMessages[i];
    const role = message.role === 'user' ? 'User' : 'Albert';
    prompt += `${role}: ${message.content}\n\n`;
  }
  
  // End the instruction block
  prompt += '[/INST] ';
  
  return prompt;
};

// Generate a cache key from messages
const generateCacheKey = (messages: Message[]): string => {
  // Only use the last user message and exclude system messages for the cache key
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length === 0) return '';
  
  const lastUserMessage = userMessages[userMessages.length - 1].content;
  return lastUserMessage.trim().toLowerCase();
};

// Sleep function for retry logic
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is a rate limit error
const isRateLimitError = (error: any): boolean => {
  return error?.message?.includes('429') || 
         error?.message?.includes('rate limit') || 
         error?.message?.includes('too many requests');
};

// Clean up the model's response
const cleanResponse = (text: string): string => {
  // Remove any remaining Mistral formatting tags
  let cleaned = text.replace(/<s>|<\/s>|\[INST\]|\[\/INST\]/g, '');
  
  // Remove any "Assistant:" prefix that might be in the response
  cleaned = cleaned.replace(/^Assistant:\s*/i, '');
  
  // Remove any "System:" prefix that might be in the response
  cleaned = cleaned.replace(/^System:\s*/i, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
};

// Send a message to Hugging Face and get a response
export const sendMessageToHuggingFace = async (
  messages: Message[],
  onPartialResponse?: (text: string) => void
): Promise<string> => {
  // Check cooldown period
  const now = Date.now();
  const timeElapsed = now - lastRequestTime;
  
  if (timeElapsed < COOLDOWN_PERIOD) {
    const waitTime = COOLDOWN_PERIOD - timeElapsed;
    console.log(`Enforcing cooldown period. Waiting ${waitTime}ms before making another request.`);
    
    if (onPartialResponse) {
      onPartialResponse(`I'm thinking... (Please wait a moment)`);
    }
    
    await sleep(waitTime);
  }
  
  // Update last request time
  lastRequestTime = Date.now();
  
  // Check cache first
  const cacheKey = generateCacheKey(messages);
  const cachedResponse = responseCache[cacheKey];
  
  if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
    console.log('Using cached response');
    
    if (onPartialResponse) {
      // Simulate streaming for better UX even when using cache
      const words = cachedResponse.response.split(' ');
      let partialResponse = '';
      
      for (let i = 0; i < words.length; i++) {
        partialResponse += (i > 0 ? ' ' : '') + words[i];
        onPartialResponse(partialResponse);
        await sleep(10); // Small delay between words
      }
    }
    
    return cachedResponse.response;
  }
  
  const MAX_RETRIES = 3;
  let retries = 0;
  let lastError: any = null;
  
  while (retries < MAX_RETRIES) {
    try {
      const hf = initHuggingFace();
      
      if (!hf) {
        throw new Error('Hugging Face API not initialized');
      }
      
      // Format messages for text generation
      const prompt = formatMessagesForHuggingFace(messages);
      
      // Use a good open-source model for chat
      // Options: mistralai/Mistral-7B-Instruct-v0.2, meta-llama/Llama-2-7b-chat-hf, etc.
      const modelId = 'mistralai/Mistral-7B-Instruct-v0.2';
      
      // If we have a streaming callback, simulate streaming with chunks
      if (onPartialResponse) {
        // Start with an empty response
        let partialResponse = '';
        onPartialResponse(partialResponse);
        
        // Make the API call (non-streaming, as HF JS client doesn't support streaming yet)
        const response = await hf.textGeneration({
          model: modelId,
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.2,
            do_sample: true,
            return_full_text: false
          }
        });
        
        // Get the generated text
        const generatedText = cleanResponse(response.generated_text.trim());
        
        // Simulate streaming by showing words one by one
        const words = generatedText.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          partialResponse += (i > 0 ? ' ' : '') + words[i];
          onPartialResponse(partialResponse);
          await sleep(15); // Small delay between words
        }
        
        // Cache the successful response
        if (cacheKey && generatedText) {
          responseCache[cacheKey] = {
            response: generatedText,
            timestamp: Date.now()
          };
        }
        
        return generatedText;
      } else {
        // Non-streaming response
        const response = await hf.textGeneration({
          model: modelId,
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.2,
            do_sample: true,
            return_full_text: false
          }
        });
        
        const generatedText = cleanResponse(response.generated_text.trim());
        
        // Cache the successful response
        if (cacheKey && generatedText) {
          responseCache[cacheKey] = {
            response: generatedText,
            timestamp: Date.now()
          };
        }
        
        return generatedText;
      }
    } catch (error) {
      lastError = error;
      console.error(`Error sending message to Hugging Face (attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      
      // If it's a rate limit error, wait and retry
      if (isRateLimitError(error)) {
        const backoffTime = Math.pow(2, retries) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limit exceeded. Retrying in ${backoffTime/1000} seconds...`);
        
        if (onPartialResponse) {
          onPartialResponse(`I'm thinking... (Rate limit reached, retrying in ${backoffTime/1000} seconds)`);
        }
        
        await sleep(backoffTime);
        retries++;
      } else {
        // For other errors, don't retry
        break;
      }
    }
  }
  
  // If we've exhausted retries or hit a non-rate-limit error
  console.error('Failed to get response from Hugging Face after retries:', lastError);
  
  // Provide a helpful message based on the error type
  if (isRateLimitError(lastError)) {
    return "I apologize, but I've reached my rate limit with the Hugging Face API. Please try again in a moment.";
  } else {
    return 'I apologize, but I am currently unable to process your request. Please try again later.';
  }
};

// Check if Hugging Face API is available (has API key)
export const isHuggingFaceAvailable = (): boolean => {
  return !!import.meta.env.VITE_HUGGINGFACE_API_KEY;
}; 