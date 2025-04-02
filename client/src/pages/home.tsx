import { motion, AnimatePresence } from "framer-motion";
import profileImage from "../assets/images/profile.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Project, type ProjectCategory } from "@shared/schema";
import { Github, Link as LinkIcon, Trophy, X, Award, GraduationCap, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
// Import the scrollbar hiding styles
import "@/styles/scrollbar-hide.css";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("Featured");
  const categories: (ProjectCategory | "All")[] = ["Featured", "Web Apps", "Mobile Apps", "Chrome Extensions", "Cybersecurity", "Open Source Contributions", "Operating System", "All"];
  const [honorsAwardsOpen, setHonorsAwardsOpen] = useState(false);

  // Handle scroll within honors panel to prevent propagation
  const handleHonorsPanelScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // Fetch projects directly from the public data file instead of the API
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/projects.json"],
    queryFn: getQueryFn<Project[]>({ on401: "throw" }),
  });

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter((project) => {
        if (selectedCategory === "Featured") {
          return project.category === "Featured";
        } else {
          // Show project if either its category matches OR if it's a Featured project with matching originalCategory
          // Special cases for Puter project (id=10) to appear in multiple categories
          return project.category === selectedCategory || 
                (project.category === "Featured" && 
                 (project.originalCategory === selectedCategory ||
                  // Make Puter project appear in Operating System category
                  (project.id === 10 && selectedCategory === "Operating System") ||
                  // Also keep Puter project in Open Source Contributions category
                  (project.id === 10 && selectedCategory === "Open Source Contributions")));
        }
      });

  return (
    <div className="flex flex-col items-center">
      {/* Profile Section */}
      <div className="flex w-full flex-col items-center justify-start pt-12 mb-12 relative overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 md:px-6 max-w-5xl"
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex items-center justify-center relative w-full">
              {/* Button to toggle honors and awards panel */}
              <Button
                variant="outline"
                className="fixed left-4 top-[120px] flex items-center justify-center h-12 pl-8 pr-6 rounded-full border-2 border-primary hover:bg-muted/50 text-md font-medium z-30"
                onClick={() => setHonorsAwardsOpen(!honorsAwardsOpen)}
              >
                <Trophy className="h-5 w-5 mr-2" />
                Honors & Awards
              </Button>
              
              {/* Custom overlay for honors and awards that doesn't block interaction */}
              <AnimatePresence mode="wait">
                {honorsAwardsOpen && (
                  <motion.div 
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ 
                      enter: {
                        type: "spring",
                        damping: 25,
                        stiffness: 300
                      },
                      exit: {
                        type: "tween", 
                        ease: "easeInOut",
                        duration: 0.35
                      }
                    }}
                    className="fixed left-0 top-0 h-screen w-[350px] bg-background/95 backdrop-blur-sm shadow-lg z-20 overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the panel
                  >
                    {/* Header with title - now with more spacing and stronger styling */}
                    <div className="p-5 flex justify-between items-center border-b-2 border-primary sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
                      <h2 className="text-2xl font-bold flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-primary" />
                        Honors & Awards
                      </h2>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => setHonorsAwardsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Content area with significant top margin for separation */}
                    <div 
                      className="px-4 pb-8 pt-12 mt-10 h-[calc(100vh-130px)] overflow-y-auto scrollbar-hide"
                      onScroll={handleHonorsPanelScroll}
                    >
                      {/* Remove the title div entirely and connect directly to the content */}
                      <div className="space-y-10">
                        {/* Reduce padding to bring content up slightly */}
                        <div className="pt-16">
                          {/* Academic Honors */}
                          <section className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                              Academic Achievements
                            </h2>
                            <ul className="space-y-3 pl-2">
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Dean's List (8 Semesters)</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, 2019-2024</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Master of Science in Computer Science with Distinction</span>
                                <span className="text-sm text-muted-foreground">August 2024</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">CAA Commissioners Academic Honor Roll</span>
                                <span className="text-sm text-muted-foreground">2020-2023 (5 times)</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Hofstra Athletic Directors Scholars Academic Honor Roll</span>
                                <span className="text-sm text-muted-foreground">2021-2023 (3 times)</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">ITA Scholar-Athlete</span>
                                <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, 2021 & 2023</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">SAT Score: 1440</span>
                                <span className="text-sm text-muted-foreground">97th percentile nationally, 2018</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">AP Scholar</span>
                                <span className="text-sm text-muted-foreground">CollegeBoard, 2018</span>
                                <span className="text-sm text-muted-foreground">Score 5/5 on three AP exams</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">High School Honors</span>
                                <span className="text-sm text-muted-foreground">Rafa Nadal Academy, 2018</span>
                              </li>
                            </ul>
                          </section>

                          {/* Athletic Honors */}
                          <section className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                              <Trophy className="h-5 w-5 mr-2 text-primary" />
                              Athletic Honors
                            </h2>
                            <ul className="space-y-3 pl-2">
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Team Captain, Division 1 Men's Tennis Team</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, 2022-2024 (2 seasons)</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Nick Colleluori Unsung Hero Award Nominee</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, May 2024</span>
                                <span className="text-sm text-muted-foreground">Recognizes student-athletes who help their teams achieve success in ways not measured by statistics</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Team Pride Award</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, May 2023 & May 2024</span>
                                <span className="text-sm text-muted-foreground">Honors student-athletes who are selfless and always put their team first</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Strength and Conditioning Athlete of the Year</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, May 2023</span>
                                <span className="text-sm text-muted-foreground">For outstanding performance and commitment to strength and conditioning</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Strength and Conditioning Athlete of the Year Nominee</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, May 2022</span>
                                <span className="text-sm text-muted-foreground">One of four finalists for the award</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">ITA Northeast Super Regionals Qualifier</span>
                                <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, October 2023</span>
                                <span className="text-sm text-muted-foreground">First qualifier in Hofstra tennis history to the Super Regionals held at Princeton</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">ITA Northeast Regionals Qualifier</span>
                                <span className="text-sm text-muted-foreground">Intercollegiate Tennis Association, October 2022 & 2023</span>
                                <span className="text-sm text-muted-foreground">Tournament featuring top men's players across the Northeast region</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Academic All-Conference Team</span>
                                <span className="text-sm text-muted-foreground">Colonial Athletic Association, 2022-2023</span>
                              </li>
                            </ul>
                          </section>

                          {/* Professional Recognition */}
                          <section className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                              <Medal className="h-5 w-5 mr-2 text-primary" />
                              Professional Recognition & Leadership
                            </h2>
                            <ul className="space-y-3 pl-2">
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Digital Remedy Venture Challenge Finalist</span>
                                <span className="text-sm text-muted-foreground">Hofstra University, May 2022 & May 2023</span>
                                <span className="text-sm text-muted-foreground">Presented BoJo entrepreneurial venture twice as finalist</span>
                              </li>
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Colonel E. David Wojcik, Jr Leadership Academy</span>
                                <span className="text-sm text-muted-foreground">Hofstra University Athletics, September 2022</span>
                                <span className="text-sm text-muted-foreground">Selected for student-athlete leadership and mentorship program</span>
                              </li>
                            </ul>
                          </section>

                          {/* Memberships & Affiliations */}
                          <section className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                              <Award className="h-5 w-5 mr-2 text-primary" />
                              Memberships & Affiliations
                            </h2>
                            <ul className="space-y-3 pl-2">
                              <li className="flex flex-col border-l-2 border-muted pl-3 py-1 hover:border-primary transition-colors">
                                <span className="font-medium">Theta Tau Professional Engineering Fraternity</span>
                                <span className="text-sm text-muted-foreground">Member, 2021-2024</span>
                              </li>
                            </ul>
                          </section>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary mb-2 shadow-lg">
                <img
                  src={profileImage}
                  alt="Jonathan Mahrt Guyou"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none">
                Jonathan Mahrt Guyou
              </h1>
              <p className="mx-auto max-w-[800px] text-gray-500 text-xl md:text-2xl dark:text-gray-400 mt-2">
                Transforming ideas into impactful solutions
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Section with Subtle White Background */}
      <div className="container w-full mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-10"
        >
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Projects</h2>

          {/* Custom Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`mr-8 py-2 px-1 text-base transition-colors relative
                    ${selectedCategory === category 
                      ? 'text-primary font-bold border-b-4 border-primary' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              {selectedCategory === "All" 
                ? "No projects found. Add some from the admin dashboard!" 
                : `No projects found in the "${selectedCategory}" category.`}
            </div>
          ) : (
            <div className="grid gap-16 md:gap-20 md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4"
                >
                  <Card className="overflow-hidden h-full rounded-xl shadow-md bg-slate-50 dark:bg-slate-900">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{project.title}</CardTitle>
                        <Badge variant="secondary">{project.category}</Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Custom buttons */}
                        {project.buttons && project.buttons.map((button, idx) => (
                          <a key={idx} href={button.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="mb-2">
                              {button.label === 'Code' && <Github className="h-4 w-4 mr-2" />}
                              {button.label === 'Website' && <LinkIcon className="h-4 w-4 mr-2" />}
                              {button.label === 'Details' && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M12 16v-4"></path>
                                  <path d="M12 8h.01"></path>
                                </svg>
                              )}
                              {button.label === 'Walkthrough' && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              )}
                              {button.label}
                            </Button>
                          </a>
                        ))}
                        
                        {/* Standard buttons */}
                        {!project.buttons?.some(b => b.label === 'Demo') && project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="mb-2">
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Demo
                            </Button>
                          </a>
                        )}
                        {!project.buttons?.some(b => b.label === 'Code') && project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="mb-2">
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </Button>
                          </a>
                        )}
                        {project.videoWalkthrough && (
                          <a href={project.videoWalkthrough} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                              Walkthrough
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
