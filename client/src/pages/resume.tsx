import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function Resume() {
  const handleDownload = () => {
    // Replace this URL with your actual resume PDF URL
    const pdfUrl = "/resume.pdf";
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="container py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter">Resume</h1>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Experience Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Experience</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Senior Software Engineer</h3>
                    <p className="text-muted-foreground">Tech Company • 2020 - Present</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Led development of cloud-native applications</li>
                      <li>Implemented microservices architecture</li>
                      <li>Mentored junior developers</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Education Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Education</h2>
                <div>
                  <h3 className="text-lg font-medium">Bachelor of Science in Computer Science</h3>
                  <p className="text-muted-foreground">University Name • 2016 - 2020</p>
                </div>
              </section>

              {/* Skills Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Programming Languages</h3>
                    <p className="text-muted-foreground">JavaScript, TypeScript, Python, Java</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Technologies</h3>
                    <p className="text-muted-foreground">React, Node.js, AWS, Docker</p>
                  </div>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
