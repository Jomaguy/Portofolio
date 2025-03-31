import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  onContinue: () => void;
}

export function WelcomeMessage({ onContinue }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleContinue = () => {
    setIsVisible(false);
    onContinue();
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
          style={{ backdropFilter: 'blur(3px)' }}
        >
          <motion.div 
            className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl max-w-3xl w-full p-8 border border-gray-200/50 dark:border-gray-800/50"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <span className="text-8xl" role="img" aria-label="Albert">🤵‍♂️</span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50">Welcome to Jonathan's Portfolio</h2>
                <p className="text-lg mb-3">
                  Greetings! I'm Albert, Jonathan's personal AI butler and portfolio concierge.
                </p>
                <p className="text-lg mb-3">
                  I'm here to assist you in exploring Jonathan's work and expertise in software engineering. Whether you're interested in his projects, technical skills, or professional background, I'm at your service.
                </p>
                <p className="text-lg mb-3">
                  You can explore Jonathan's achievements in the Honors & Awards section available on the side of the portfolio.
                </p>
                <p className="text-lg">
                  You'll find me at the bottom right corner of your screen throughout your visit. Feel free to ask me anything about Jonathan's experience, projects, or how to navigate this portfolio.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleContinue}
                size="lg"
                className="px-10 py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Portfolio
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 