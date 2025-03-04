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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();

    // Send the system prompt first
    await chat.sendMessage(SYSTEM_PROMPT);

    // Send the user's message
    const userMessage = messages[messages.length - 1].content;
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