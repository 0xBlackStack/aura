"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { trpc } from "@/trpc/react"; // ✅ CORRECT
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const ProjectsList = () => {
    const { user } = useUser();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const utils = trpc.useUtils();

    // 🛑 If not logged in, don't fetch
    const { data: projects = [], isLoading } =
        trpc.projects.getMany.useQuery(undefined, {
            enabled: !!user,
        });

    const deleteMutation = trpc.projects.delete.useMutation({
        onSuccess: (data) => {
            toast.success(`Project "${data.projectName}" deleted successfully`);
            // Invalidate and refetch projects list
            utils.projects.getMany.invalidate();
            setDeleteDialogOpen(false);
            setProjectToDelete(null);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete project");
        },
    });

    const handleDeleteClick = (
        e: React.MouseEvent,
        projectId: string,
        projectName: string
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete({ id: projectId, name: projectName });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (projectToDelete) {
            deleteMutation.mutate({ id: projectToDelete.id });
        }
    };

    if (!user) return null;

    return (
        <>
            <motion.div 
                className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 lg:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <motion.h2 
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {user.firstName ? `${user.firstName}'s` : "Your"} projects in Aurix
                </motion.h2>

                {isLoading && (
                    <p className="text-sm text-muted-foreground">
                        Loading your projects…
                    </p>
                )}

                {!isLoading && projects.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                        You haven&apos;t created any projects in Aurix yet.
                    </p>
                )}

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Button
                                variant="outline"
                                className="w-full h-auto justify-start p-4 text-left"
                                asChild
                            >
                                <Link href={`/projects/${project.id}`}>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src="/logo.png"
                                            alt="Aurix"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />

                                        <div className="flex flex-col overflow-hidden">
                                            <h3 className="truncate font-medium">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(
                                                    new Date(project.updatedAt),
                                                    { addSuffix: true }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </Button>

                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) =>
                                    handleDeleteClick(e, project.id, project.name)
                                }
                                disabled={deleteMutation.isPending}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete project</span>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            project <strong>&quot;{projectToDelete?.name}&quot;</strong> and all
                            associated messages and fragments.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
