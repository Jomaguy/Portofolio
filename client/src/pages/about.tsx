import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import profileImage from "../assets/images/profile.jpg";

export default function About() {
  return (
    <div className="container py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 md:grid-cols-[1fr_2fr]"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter mb-4">About Me</h1>
            <p className="text-lg text-muted-foreground">
              I'm a Full Stack Software Engineer with a Master's degree in Computer Science from Hofstra University. 
              As a former Division 1 athlete and team captain, I bring strong leadership and teamwork skills to my 
              software engineering projects. I specialize in full-stack development, AI implementation, and mobile app development.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Programming</h3>
                  <p className="text-sm text-muted-foreground">
                    Python, Java, JavaScript, TypeScript, Swift, SQL
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <p className="text-sm text-muted-foreground">
                    French (Native), Danish (Native), Spanish (Fluent), Catalan (Fluent), English (Fluent)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Frameworks & Technologies</h3>
                  <p className="text-sm text-muted-foreground">
                    React, Next.js, Django, Firebase, Flask, PyTorch, Scikit-learn
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Leadership</h3>
                  <p className="text-sm text-muted-foreground">
                    Scrum Master, Team Leadership, Project Management, Agile Methodologies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
