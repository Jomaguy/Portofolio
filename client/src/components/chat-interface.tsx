import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { type Project } from "@shared/schema";

// Define the Puter type for TypeScript
declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (prompt: any, options: any) => Promise<any>;
      };
    };
  }
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPuterAvailable, setIsPuterAvailable] = useState(false);
  const { toast } = useToast();
  const [sessionId] = useState(() => nanoid());

  // Fetch projects to include in the context for the AI
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: getQueryFn<Project[]>({ on401: "throw" }),
  });

  // Check if Puter.js is available
  useEffect(() => {
    const checkPuter = () => {
      if (window.puter) {
        setIsPuterAvailable(true);
      }
    };

    // Check immediately
    checkPuter();

    // Also check after a short delay to allow for script loading
    const timer = setTimeout(checkPuter, 1000);
    return () => clearTimeout(timer);
  }, []);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      if (isPuterAvailable && window.puter) {
        // Use Puter.js with Claude 3.5 Sonnet
        
        // Create a project context string for the AI
        const projectsContext = projects.map(p => 
          `Project: ${p.title}
          Description: ${p.description}
          Technologies: ${p.technologies.join(", ")}
          Category: ${p.category}
          Links: ${p.link ? `Demo: ${p.link}` : ""} ${p.github ? `GitHub: ${p.github}` : ""}`
        ).join("\n\n");
        
        const systemPrompt = `You are an AI butler/concierge for a software engineer's portfolio website. Your role is to:
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
          
          Here are the projects in the portfolio:
          ${projectsContext}
          
          Always be helpful and guide users to the most relevant information based on their interests.`;
        
        // Format the conversation for Claude
        const formattedMessages = [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage }
        ];
        
        try {
          // First try with streaming for better UX
          const response = await window.puter.ai.chat(
            formattedMessages,
            { model: 'claude-3-5-sonnet', stream: true }
          );
          
          let fullResponse = "";
          let hasStartedResponse = false;
          
          for await (const part of response) {
            if (part?.text) {
              fullResponse += part.text;
              
              // For the first chunk, add a new message
              if (!hasStartedResponse) {
                setMessages(prev => [...prev, { role: "assistant", content: fullResponse }]);
                hasStartedResponse = true;
              } else {
                // For subsequent chunks, update the existing message
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = fullResponse;
                  return newMessages;
                });
              }
            }
          }
        } catch (streamError) {
          console.warn("Streaming failed, falling back to non-streaming mode", streamError);
          
          // Fallback to non-streaming if streaming fails
          const response = await window.puter.ai.chat(
            formattedMessages,
            { model: 'claude-3-5-sonnet' }
          );
          
          const aiResponse = response.message.content[0].text;
          setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
        }
      } else {
        // Fallback to the original server-side implementation
        const response = await apiRequest<{ message: string }>("POST", "/api/chat", {
          message: userMessage,
          sessionId,
        });

        setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>AI Assistant {isPuterAvailable ? "(Claude 3.5 Sonnet)" : ""}</SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            <AnimatePresence initial={false}>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}