import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter mb-4">About Me</h1>
            <p className="text-lg text-muted-foreground">
              I'm a Full Stack Software Engineer with over 5 years of experience building
              scalable web applications. I specialize in React, Node.js, and cloud
              technologies.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <p className="text-sm text-muted-foreground">
                    React, TypeScript, Tailwind CSS, Next.js
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Backend</h3>
                  <p className="text-sm text-muted-foreground">
                    Node.js, Express, PostgreSQL, GraphQL
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Cloud & DevOps</h3>
                  <p className="text-sm text-muted-foreground">
                    AWS, Docker, Kubernetes, CI/CD
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Tools & Methods</h3>
                  <p className="text-sm text-muted-foreground">
                    Git, Agile, TDD, System Design
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
