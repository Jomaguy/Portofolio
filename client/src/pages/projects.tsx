import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projectData, ProjectCategory } from "@shared/schema";
import { Github, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const categories: (ProjectCategory | "All")[] = ["All", "Web Apps", "Mobile Apps", "Chrome Extensions", "Other"];

  const filteredProjects = selectedCategory === "All" 
    ? projectData 
    : projectData.filter(project => project.category === selectedCategory);

  return (
    <div className="container py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tighter mb-8">Projects</h1>

        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full">
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
                  <div className="flex space-x-2">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Demo
                        </Button>
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}