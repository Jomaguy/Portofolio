import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";
import { z } from "zod";
import fetch from "node-fetch";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

// Schema for chat messages
const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Email setup
  if (!process.env.SMTP_PASS || !process.env.SENDER_EMAIL || !process.env.RECIPIENT_EMAIL) {
    throw new Error('Missing required email configuration environment variables');
  }

  const SENDER_EMAIL = process.env.SENDER_EMAIL;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
  const SMTP_PASS = process.env.SMTP_PASS;

  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: SMTP_PASS
    }
  });

  // Verify the connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log("SMTP connection error:", error);
    } else {
      console.log("SMTP server is ready to take our messages");
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = contactSchema.parse(req.body);

      await transporter.sendMail({
        from: {
          name: "Jonathan Mahrt",
          address: SENDER_EMAIL
        },
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: `Portfolio Contact Form: Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h2>New Message from Portfolio Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Public Projects API endpoint
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  // Resume API endpoint
  app.get("/api/resume", async (req, res) => {
    const resume = await storage.getResume();
    res.json(resume);
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate the request body
      const { messages } = chatRequestSchema.parse(req.body);
      
      // Format messages for the AI model
      const formattedMessages = formatMessagesForAI(messages);
      
      // Check if we have a Hugging Face API key
      if (!process.env.HUGGINGFACE_API_KEY) {
        return res.status(500).json({ 
          error: "Hugging Face API key not configured on the server" 
        });
      }
      
      // Call Hugging Face API
      const response = await callHuggingFaceAPI(formattedMessages);
      
      // Return the response
      res.json({ response });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ 
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Create HTTP server
  const server = createServer(app);
  return server;
}

// Format messages for the AI model
function formatMessagesForAI(messages: Array<{ role: string; content: string }>) {
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
  prompt += 'IMPORTANT: This is an ongoing conversation with the user. You MUST maintain context from all previous messages.\n\n';
  prompt += 'CONVERSATION RULES:\n';
  prompt += '1. NEVER introduce yourself again after the first message\n';
  prompt += '2. NEVER use greetings like "Hello", "Good day", "Greetings" in follow-up messages\n';
  prompt += '3. NEVER pretend each message is a new conversation\n';
  prompt += '4. Respond directly to the user\'s most recent query without preamble\n';
  prompt += '5. Maintain a professional butler tone but be direct and concise\n';
  prompt += '6. Do not use emoji or special characters in your responses\n\n';
  
  // Add the conversation history
  prompt += 'Conversation history:\n';
  
  // Check if this is a follow-up message
  const isFollowUp = chatMessages.filter(m => m.role === 'assistant').length > 0;
  
  for (let i = 0; i < chatMessages.length; i++) {
    const message = chatMessages[i];
    const role = message.role === 'user' ? 'User' : 'Albert';
    prompt += `${role}: ${message.content}\n\n`;
  }
  
  // Add an extra reminder if this is a follow-up message
  if (isFollowUp) {
    prompt += 'REMINDER: This is a follow-up message in an ongoing conversation. Do NOT reintroduce yourself or use any greeting. Respond directly to the user\'s query.\n\n';
  }
  
  // End the instruction block
  prompt += '[/INST] ';
  
  return prompt;
}

// Call Hugging Face API
async function callHuggingFaceAPI(prompt: string) {
  const modelId = 'mistralai/Mistral-7B-Instruct-v0.2';
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2,
          do_sample: true,
          return_full_text: false
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Hugging Face API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as Array<{generated_text: string}>;
    
    // Clean up the response
    let generatedText = data[0]?.generated_text || '';
    
    // Remove any remaining Mistral formatting tags
    generatedText = generatedText.replace(/<s>|<\/s>|\[INST\]|\[\/INST\]/g, '');
    
    // Remove any "Assistant:" prefix that might be in the response
    generatedText = generatedText.replace(/^Assistant:\s*/i, '');
    
    // Remove any "System:" prefix that might be in the response
    generatedText = generatedText.replace(/^System:\s*/i, '');
    
    // Trim whitespace
    generatedText = generatedText.trim();
    
    return generatedText;
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    throw error;
  }
}