import { useState, useEffect, useRef } from "react";
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
import { Send, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { type Project } from "@shared/schema";
import { sendMessageToHuggingFace, isHuggingFaceAvailable, type Message as HuggingFaceMessage } from "@/services/huggingface";

// Define the Message interface
interface Message {
  role: "user" | "assistant";
  content: string;
}

// Helper function to format message content with proper paragraph breaks, list formatting, and code blocks
const formatMessageContent = (content: string) => {
  // Check if the content contains code blocks
  const hasCodeBlocks = /```[\s\S]*?```/.test(content);
  
  if (hasCodeBlocks) {
    const segments = [];
    let lastIndex = 0;
    let inCodeBlock = false;
    let currentLanguage = '';
    let currentContent = '';
    
    // Find all code blocks
    const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          segments.push(
            <div key={`text-${segments.length}`} className="mb-3 text-xl" style={{ fontSize: '1.25rem' }}>
              {formatMessageContent(textBefore)}
            </div>
          );
        }
      }
      
      // Add the code block
      const language = match[1] || 'plaintext';
      const code = match[2];
      
      segments.push(
        <div key={`code-${segments.length}`} className="mb-3 rounded bg-gray-100 dark:bg-gray-900 p-3 font-mono text-lg overflow-x-auto" style={{ fontSize: '1.2rem' }}>
          {code.split('\n').map((line, i) => (
            <div key={i} className="whitespace-pre" style={{ fontSize: '1.2rem' }}>
              {line}
            </div>
          ))}
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text after the last code block
    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      if (textAfter.trim()) {
        segments.push(
          <div key={`text-${segments.length}`} className="mb-3 text-xl" style={{ fontSize: '1.25rem' }}>
            {formatMessageContent(textAfter)}
          </div>
        );
      }
    }
    
    return segments;
  }
  
  // Check if the content contains numbered lists (e.g., "1. Item")
  const hasNumberedList = /^\d+\.\s.+/m.test(content);
  // Check if the content contains bullet lists (e.g., "- Item" or "• Item")
  const hasBulletList = /^[-•]\s.+/m.test(content);
  
  // If we have lists, do special formatting
  if (hasNumberedList || hasBulletList) {
    // Split by newlines
    const lines = content.split(/\n/);
    let inList = false;
    let listItems: string[] = [];
    let result: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    
    lines.forEach((line, index) => {
      const isNumberedItem = /^\d+\.\s(.+)/.exec(line);
      const isBulletItem = /^[-•]\s(.+)/.exec(line);
      
      if (isNumberedItem || isBulletItem) {
        // If we were building a paragraph, add it to results
        if (currentParagraph.length > 0) {
          result.push(<p key={`p-${index}`} className="mb-2">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        
        // Start or continue a list
        if (!inList) {
          inList = true;
          listItems = [];
        }
        
        // Add the item text (without the bullet/number)
        const itemText = isNumberedItem ? isNumberedItem[1] : isBulletItem![1];
        listItems.push(itemText);
      } else {
        // End any current list
        if (inList) {
          const listType = hasNumberedList ? "ol" : "ul";
          result.push(
            listType === "ol" ? (
              <ol key={`list-${index}`} className="list-decimal pl-5 mb-3 space-y-1 text-xl" style={{ fontSize: '1.25rem' }}>
                {listItems.map((item, i) => <li key={i} style={{ fontSize: '1.25rem' }}>{item}</li>)}
              </ol>
            ) : (
              <ul key={`list-${index}`} className="list-disc pl-5 mb-3 space-y-1 text-xl" style={{ fontSize: '1.25rem' }}>
                {listItems.map((item, i) => <li key={i} style={{ fontSize: '1.25rem' }}>{item}</li>)}
              </ul>
            )
          );
          inList = false;
          listItems = [];
        }
        
        // Handle empty lines as paragraph breaks
        if (line.trim() === '') {
          if (currentParagraph.length > 0) {
            result.push(<p key={`p-${index}`} className="mb-2">{currentParagraph.join(' ')}</p>);
            currentParagraph = [];
          }
        } else {
          // Add to current paragraph
          currentParagraph.push(line);
        }
      }
    });
    
    // Handle any remaining list
    if (inList) {
      const listType = hasNumberedList ? "ol" : "ul";
      result.push(
        listType === "ol" ? (
          <ol key="list-end" className="list-decimal pl-5 mb-3 space-y-1 text-xl" style={{ fontSize: '1.25rem' }}>
            {listItems.map((item, i) => <li key={i} style={{ fontSize: '1.25rem' }}>{item}</li>)}
          </ol>
        ) : (
          <ul key="list-end" className="list-disc pl-5 mb-3 space-y-1 text-xl" style={{ fontSize: '1.25rem' }}>
            {listItems.map((item, i) => <li key={i} style={{ fontSize: '1.25rem' }}>{item}</li>)}
          </ul>
        )
      );
    }
    
    // Handle any remaining paragraph text
    if (currentParagraph.length > 0) {
      result.push(<p key="p-end" className="mb-2">{currentParagraph.join(' ')}</p>);
    }
    
    return result;
  }
  
  // Regular paragraph handling (no lists or code blocks)
  const paragraphs = content.split(/\n\n+/);
  
  if (paragraphs.length <= 1) {
    // If there are no double newlines, try splitting by single newlines
    const lines = content.split(/\n/);
    if (lines.length > 1) {
      return lines.map((line, i) => (
        <p key={i} className={i > 0 ? "mt-2 text-xl" : "text-xl"} style={{ fontSize: '1.25rem' }}>{line}</p>
      ));
    }
    return <p className="text-xl" style={{ fontSize: '1.25rem' }}>{content}</p>;
  }
  
  return paragraphs.map((paragraph, i) => (
    <p key={i} className={i > 0 ? "mt-3 text-xl" : "text-xl"} style={{ fontSize: '1.25rem' }}>{paragraph}</p>
  ));
};

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHuggingFaceReady, setIsHuggingFaceReady] = useState(false);
  const [chatSize, setChatSize] = useState<'normal' | 'large'>('normal');
  const [isResizing, setIsResizing] = useState(false);
  const [customSize, setCustomSize] = useState({ width: 0, height: 0 });
  const { toast } = useToast();
  const [sessionId] = useState(() => nanoid());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialResizePosition = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  // Fetch projects to include in the context for the AI
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/projects.json"],
    queryFn: getQueryFn<Project[]>({ on401: "throw" }),
  });

  // Fetch resume data to include in the context for the AI
  const { data: resume } = useQuery({
    queryKey: ["/resume.json"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Check if Hugging Face is available
  useEffect(() => {
    setIsHuggingFaceReady(isHuggingFaceAvailable());
  }, []);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Create a project context string for the AI
      const projectsContext = projects.map(p => 
        `Project: ${p.title}
        Description: ${p.description}
        Technologies: ${p.technologies.join(", ")}
        Category: ${p.category}
        Links: ${p.link ? `Demo: ${p.link}` : ""} ${p.github ? `GitHub: ${p.github}` : ""}`
      ).join("\n\n");

      // Create a resume context string for the AI
      const resumeContext = resume ? JSON.stringify(resume, null, 2) : "";
      
      // Define the system prompt
      const systemPrompt = `You are Albert, a professional AI butler for Jonathan Mahrt Guyou's portfolio website. You should maintain a polite, professional butler persona in your interactions.

      Your role is to:
      1. Help visitors navigate Jonathan's portfolio website and find information about him
      2. Answer questions about Jonathan's projects, skills, and professional experience
      3. Provide detailed technical explanations when asked about specific projects
      4. Maintain a professional, courteous, and helpful butler tone
      5. Assist visitors in contacting Jonathan or viewing his resume
      
      IMPORTANT CONVERSATION GUIDELINES:
      - Maintain context throughout the conversation
      - Only introduce yourself in your first response to a user
      - For follow-up questions, respond directly without reintroducing yourself
      - Remember previous questions and refer back to them when relevant
      - Be concise in your responses while remaining helpful and informative
      
      The website has a single-page design with the following sections:
      - Home: The main page featuring Jonathan's profile and all his projects
      - Resume: Available through the "Resume" button in the navigation bar (opens a modal)
      - Contact: Available through the "Contact Me" button in the navigation bar (opens a contact form)
      
      Projects are categorized as:
      - Web Apps
      - Mobile Apps
      - Chrome Extensions
      - Cybersecurity
      - Other
      
      Here are the specific projects in Jonathan's portfolio:
      ${projectsContext}

      Here is Jonathan's resume information:
      ${resumeContext}

      Always introduce yourself as Albert, Jonathan's professional butler in your FIRST message only. Be helpful, informative, and guide users to the most relevant information based on their interests. Maintain a professional butler demeanor while avoiding overly deferential language.`;
      
      // Format messages for the AI service
      const formattedMessages: HuggingFaceMessage[] = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }) as HuggingFaceMessage),
        { role: "user", content: userMessage }
      ];
      
      // Add initial "thinking" message
      setMessages(prev => [...prev, { role: "assistant", content: "I'm thinking..." }]);
      
      // Try to use the API endpoint first
      try {
        const apiResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: formattedMessages
          }),
        });
        
        if (!apiResponse.ok) {
          throw new Error(`API responded with status: ${apiResponse.status}`);
        }
        
        const data = await apiResponse.json();
        
        // Update the message with the response
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = data.response;
          return newMessages;
        });
        
        return;
      } catch (apiError) {
        console.error("Error using API endpoint:", apiError);
        // Fall back to client-side implementation if API fails
      }
      
      // Fallback to client-side implementation
      if (isHuggingFaceReady) {
        // Send message to Hugging Face with streaming
        const hfResponse = await sendMessageToHuggingFace(formattedMessages, (partialResponse) => {
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = partialResponse;
            return newMessages;
          });
        });
        
        // If sendMessageToHuggingFace returns without using the callback (error case)
        // Make sure we update the message with the error response
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[newMessages.length - 1].content === "I'm thinking...") {
            newMessages[newMessages.length - 1].content = hfResponse;
          }
          return newMessages;
        });
      } else {
        throw new Error("Hugging Face API is not available");
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        title: "Chat Error",
        description: "Unable to get a response from Albert at this time. Please try again later.",
        variant: "destructive",
      });
      
      // Add a fallback message
      setMessages(prev => {
        // Check if we already added a thinking message
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === "assistant" && lastMessage.content === "I'm thinking...") {
          // Update the existing message
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = "I apologize, but I'm currently unable to assist you. Please try again later.";
          return newMessages;
        } else {
          // Add a new message
          return [
            ...prev, 
            { 
              role: "assistant", 
              content: "I apologize, but I'm currently unable to assist you. Please try again later." 
            }
          ];
        }
      });
    } finally {
      setIsLoading(false);
    }
  }

  const toggleChatSize = () => {
    setChatSize(prev => prev === 'normal' ? 'large' : 'normal');
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!chatContainerRef.current) return;
    
    setIsResizing(true);
    initialResizePosition.current = { x: e.clientX, y: e.clientY };
    
    const rect = chatContainerRef.current.getBoundingClientRect();
    initialSize.current = { width: rect.width, height: rect.height };
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - initialResizePosition.current.x;
    const deltaY = e.clientY - initialResizePosition.current.y;
    
    // Calculate new width and height
    const newWidth = Math.max(300, initialSize.current.width + deltaX);
    const newHeight = Math.max(300, initialSize.current.height + deltaY);
    
    setCustomSize({ width: newWidth, height: newHeight });
  };

  const stopResize = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  // Calculate dynamic sizes based on the current chatSize
  const getChatDimensions = () => {
    if (chatSize === 'large') {
      return {
        width: 'w-[90vw] sm:w-[70vw] md:w-[60vw]',
        height: 'h-[70vh]',
        position: 'bottom-20 right-20 left-20 sm:left-auto'
      };
    }
    return {
      width: 'w-[400px] sm:w-[500px]',
      height: 'h-[500px]',
      position: 'bottom-36 right-6'
    };
  };

  const { width, height, position } = getChatDimensions();

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-24 w-24 rounded-full shadow-xl bg-white hover:bg-gray-100 z-50 transition-transform duration-300 hover:scale-105 border-2 border-gray-200"
        size="icon"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-6xl" role="img" aria-label="Albert">🤵‍♂️</span>
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed ${position} ${customSize.width > 0 ? '' : width} bg-background rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-40 overflow-hidden`}
            style={{ 
              maxHeight: chatSize === 'large' ? '80vh' : 'calc(100vh - 200px)',
              width: customSize.width > 0 ? `${customSize.width}px` : undefined,
              height: customSize.height > 0 ? `${customSize.height}px` : undefined
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="Albert">🤵‍♂️</span>
                <h3 className="font-semibold text-lg">Albert</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleChatSize} 
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
                  title={chatSize === 'normal' ? "Maximize chat" : "Minimize chat"}
                >
                  {chatSize === 'normal' ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)} 
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Button>
              </div>
            </div>
            
            <div className={`flex flex-col ${customSize.height > 0 ? '' : height} bg-gray-50/50 dark:bg-gray-900/50`} style={{ height: customSize.height > 0 ? `${customSize.height - 57}px` : undefined }}>
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-5xl mb-4" role="img" aria-label="Welcome">👋</span>
                  <h4 className="text-2xl font-medium mb-2" style={{ fontSize: '1.5rem' }}>Welcome to the conversation!</h4>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs text-xl" style={{ fontSize: '1.25rem' }}>
                    I'm Albert, Jonathan's AI butler. How may I assist you today?
                  </p>
                </div>
              ) : (
                <ScrollArea className="flex-1 p-4">
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
                        {message.role === "assistant" && (
                          <div className="flex-shrink-0 mr-2 mt-1">
                            <span className="text-xl" role="img" aria-label="Albert">🤵‍♂️</span>
                          </div>
                        )}
                        
                        <div
                          className={`rounded-2xl px-5 py-3 max-w-[85%] shadow-sm ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                          }`}
                          style={{ fontSize: '1.25rem' }}
                        >
                          <div className={`message-content text-xl ${message.role === "assistant" ? "prose prose-xl dark:prose-invert max-w-none" : ""}`}>
                            {message.role === "assistant" 
                              ? formatMessageContent(message.content)
                              : message.content
                            }
                          </div>
                        </div>
                        
                        {message.role === "user" && (
                          <div className="flex-shrink-0 ml-2 mt-1">
                            <span className="text-xl bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                              {/* User initial or icon */}
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ScrollArea>
              )}
              
              <form onSubmit={sendMessage} className="p-4 border-t bg-white dark:bg-gray-900 flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Albert anything..."
                  disabled={isLoading}
                  className="flex-1 h-12 text-xl rounded-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ fontSize: '1.25rem' }}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading} 
                  className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
            
            {/* Resize handle */}
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize opacity-50 hover:opacity-100 transition-opacity"
              onMouseDown={startResize}
              title="Resize chat"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 22L16 16M22 16L16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}