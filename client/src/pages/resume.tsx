import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function Resume() {
  const handleDownload = () => {
    // Use the PDF file from the public folder
    const pdfUrl = "/Resume.pdf";
    
    // Open the PDF in a new tab (this allows viewing before downloading)
    window.open(pdfUrl, "_blank");
    
    // Alternative: Direct download without preview
    // const link = document.createElement('a');
    // link.href = pdfUrl;
    // link.download = 'Jonathan_Mahrt_Guyou_Resume.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
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
          <Button onClick={handleDownload} className="flex items-center gap-2 rounded-full border-2 border-primary hover:bg-muted/50">
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Header Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">Jonathan Mahrt Guyou</h2>
                <p className="text-muted-foreground">Greater NYC Area | jonathanmahrt@icloud.com | LinkedIn Profile | GitHub Profile</p>
              </section>

              {/* Education Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Hofstra University, Hempstead NY</h3>
                    <p className="text-muted-foreground">Master of Science in Computer Science with a concentration in Networking and Security (GPA: 3.62) • Aug 2024</p>
                    <p className="text-muted-foreground">Bachelor of Science in Computer Science and Cybersecurity (GPA: 3.6) • May 2023</p>
                    <p className="text-muted-foreground mt-2">Honors: As a Student-Athlete: Captain, Division 1 Men's Tennis Team | Dean's List x8</p>
                  </div>
                </div>
              </section>

              {/* Skills Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Programming</h3>
                    <p className="text-muted-foreground">Python, Java, JavaScript, TypeScript, Swift, SQL</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Languages</h3>
                    <p className="text-muted-foreground">French (Native), Danish (Native), Spanish (Fluent), Catalan (Fluent)</p>
                  </div>
                </div>
              </section>

              {/* Experience Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Lead Software Engineer</h3>
                    <p className="text-muted-foreground">HYEL • Oct 2024 - Present</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Leading a team of 3 in developing a Swift-based iOS game, successfully delivering 90% of key milestones ahead of schedule.</li>
                      <li>Serving as Scrum Master, achieving a 95% sprint completion rate through improved planning and proactive issue resolution.</li>
                      <li>Implementing rigorous playtesting processes, resolving 85% of identified issues quickly and efficiently.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Software Engineer</h3>
                    <p className="text-muted-foreground">Laurel Links • May 2024 - Oct 2024</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Developed a full-stack website with Python, Django, and SQL to streamline communication, event sign-ups, and feedback systems.</li>
                      <li>Resolved 500+ technical issues for board members and users, increasing user satisfaction scores by 25% and site reliability by 40%.</li>
                      <li>Boosted user interaction by 40%, implementing a custom management system streamlining communication, sign-ups, and updates.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Full-Stack Developer Intern</h3>
                    <p className="text-muted-foreground">Teamwyrk • Oct 2023 - May 2024</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Developed and maintained the front and back end of the Teamwyrk website, enhancing user experience and system performance.</li>
                      <li>Engineered a backend using Firebase, managing data flow for 1000 users, and designed an intuitive front end with React JS.</li>
                      <li>Implemented Agile methodologies, reducing project delivery time and increasing team collaboration and productivity.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Founder & Lead Engineer</h3>
                    <p className="text-muted-foreground">BoJo • September 2021 - February 2024</p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Led a team of four in developing a university-matching app with automated features, helping 1000+ students find universities.</li>
                      <li>Conducted market research with counselors, admissions officers, parents, and students to refine product fit.</li>
                      <li>Placed in the top 3 in two entrepreneurship contests, earning funding and recognition for innovation and business potential.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Projects Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Selected Projects</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">AI - Spam Classifier</h3>
                    <p className="text-muted-foreground mt-2">
                      Developed an email spam classifier with Scikit-learn and PyTorch, achieving 99% accuracy in real-time spam detection and filtering. 
                      Integrated the classifier with email systems using Python's Imaplib, enabling automatic processing of 1000+ emails daily. 
                      Developed a Flask API to integrate the spam classifier with several email platforms, streamlining enterprise deployment.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">AI - Web App Firewall</h3>
                    <p className="text-muted-foreground mt-2">
                      Built and deployed an AI-powered WAF using LAMP, Python, Flask, and Scikit-learn, blocking 99% of malicious traffic. 
                      Trained an ML model to classify HTTP requests, integrating it with a Python API for real-time analysis. 
                      Integrated the WAF with Apache and implemented MySQL logging to monitor traffic patterns and enable continuous model improvement.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Click Clock - Social Video Platform</h3>
                    <p className="text-muted-foreground mt-2">
                      Built a TikTok-style video platform using Next.js and TypeScript, achieving seamless video delivery with optimized playback and progress tracking. 
                      Implemented an AI-powered recommendation system using machine learning algorithms, delivering personalized content with 95% user engagement. 
                      Developed a responsive video player component with infinite scroll and autoplay, processing 1000+ video interactions daily.
                    </p>
                  </div>
                </div>
              </section>

              {/* Notable Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Notable</h2>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Theta Tau: Member of the foremost engineering fraternity in the country • Mar 2021 - May 2024</li>
                  <li>Digital Remedy Venture Challenge: Finalist twice with BoJo • Feb 2022 - May 2023</li>
                  <li>Colonel E. David Wojcik, Jr Leadership Academy, selected to attend; completing leadership, teamwork, and decision-making workshops.</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
