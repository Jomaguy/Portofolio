import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Github, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container px-4 md:px-6 max-w-5xl"
      >
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none">
              Jonathan Mahrt Guyou
            </h1>
            <p className="mx-auto max-w-[800px] text-gray-500 text-xl md:text-2xl dark:text-gray-400 mt-4">
              Full Stack Software Engineer specialized in building scalable web applications
            </p>
          </div>
          <div className="space-x-6 mt-10">
            <Link href="/projects">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">View Projects</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">About Me</Button>
            </Link>
          </div>
          <div className="flex space-x-8 mt-16">
            <a href="https://github.com/Jomaguy" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Github className="h-6 w-6" />
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/jonathan-mahrt-guyou/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Linkedin className="h-6 w-6" />
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
