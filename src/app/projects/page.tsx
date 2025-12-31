"use client";

import { ProjectsList } from "@/modules/home/ui/components/project-list";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { motion } from "framer-motion";

export default function ProjectsPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              Your Projects
            </h1>
            <p className="text-lg text-muted-foreground">
              Create and manage your Aurix projects
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <ProjectForm />
          </div>

          <ProjectsList />
        </motion.div>
      </div>
    </div>
  );
}
