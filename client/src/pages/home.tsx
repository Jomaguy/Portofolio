import { motion } from "framer-motion";
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
import { Github, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const categories: (ProjectCategory | "All")[] = ["All", "Web Apps", "Mobile Apps", "Chrome Extensions", "Cybersecurity", "Other"];

  // Fetch projects from the API
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: getQueryFn<Project[]>({ on401: "throw" }),
  });

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="flex flex-col items-center">
      {/* Profile Section */}
      <div className="flex w-full flex-col items-center justify-start pt-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 md:px-6 max-w-5xl"
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary mb-2 shadow-lg">
              <img
                src={profileImage}
                alt="Jonathan Mahrt Guyou"
                className="w-full h-full object-cover"
              />
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
                        {project.buttons ? (
                          // Custom buttons structure
                          project.buttons.map((button, idx) => (
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
                                {button.label}
                              </Button>
                            </a>
                          ))
                        ) : (
                          // Standard button structure
                          <>
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="mb-2">
                                  <LinkIcon className="h-4 w-4 mr-2" />
                                  Demo
                                </Button>
                              </a>
                            )}
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="mb-2">
                                  <Github className="h-4 w-4 mr-2" />
                                  Code
                                </Button>
                              </a>
                            )}
                            {project.details && (
                              <a href={project.details} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="mb-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                  </svg>
                                  Details
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
                          </>
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
