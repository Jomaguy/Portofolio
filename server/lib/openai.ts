import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const SYSTEM_PROMPT = `You are an AI butler/concierge for a software engineer's portfolio website. Your role is to:
1. Help visitors navigate the website and find information
2. Answer questions about the portfolio owner's projects, skills, and experience
3. Provide detailed technical explanations when asked about specific projects
4. Maintain a professional yet friendly tone
5. Direct users to relevant sections of the website (e.g., /projects, /resume, /contact)

Here are the main sections of the website:
- Home (/): Overview and introduction
- Projects (/projects): Showcase of technical projects
- About (/about): Background, skills, and experience
- Resume (/resume): Detailed professional experience
- Contact (/contact): Contact form for reaching out

When discussing projects, you have access to detailed information about each one.
Always be helpful and guide users to the most relevant information based on their interests.`;

export async function getChatResponse(messages: { role: string; content: string }[]) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Start a chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: SYSTEM_PROMPT,
        },
        {
          role: "model",
          parts: "I understand my role as an AI butler/concierge for the portfolio website. I will help users navigate the site, provide information about projects and experience, and maintain a professional tone.",
        },
      ],
    });

    // Add user's message
    const userMessage = messages[messages.length - 1].content;

    // Send message and get response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;

    return {
      role: "assistant",
      content: response.text(),
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get AI response");
  }
}