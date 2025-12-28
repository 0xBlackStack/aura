"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowUpIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";
import { useClerk } from "@clerk/nextjs";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
    value: z
        .string()
        .min(1, { message: "Message cannot be empty" })
        .max(10000, { message: "Message is too long" }),
});

export const ProjectForm = () => {
    const router = useRouter();
    const clerk = useClerk();
    const utils = trpc.useUtils(); // ✅ THIS IS THE KEY

    const [fixP, setFixP] = useState(false);
    const [isFocused, setIsFoucsed] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    const createProject = trpc.projects.create.useMutation({
        onSuccess: async (data) => {
            // ✅ PROPER tRPC INVALIDATION
            await utils.projects.getMany.invalidate();
            await utils.usage.status.invalidate();

            router.push(`/projects/${data.id}`);
        },
        onError: (error) => {
            toast.error(error.message);

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }

            if (error.data?.code === "TOO_MANY_REQUESTS") {
                router.push("/pricing");
            }
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createProject.mutateAsync({
            enhancePrompt: fixP,
            value: values.value,
        });
    };

    const onSelect = (value: string) => {
        form.setValue("value", value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const isPending = createProject.isPending;
    const isDisabled = isPending || !form.formState.isValid;

    const { data: peUsage } = trpc.usage.statusForPE.useQuery();

    return (
        <Form {...form}>
            <section className="space-y-6 lg:mt-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all mb-0", isFocused && "shadow-xs",)}>
                    <FormField
                        control={form.control}
                        name="value"
                        render={
                            ({ field }) => (
                                <TextareaAutosize  {...field} disabled={isPending} onFocus={() => setIsFoucsed(true)} onBlur={() => setIsFoucsed(false)} minRows={2} maxRows={8} className="pt-4 resize-none border-none w-full outline-none bg-transparent cursor-target" placeholder="What would you like to build? (“Don’t paste secrets”)" onKeyDown={(e) => {
                                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)(e)
                                    }
                                }} />
                            )
                        }
                    />

                    <div className="flex gap-x-2 items-end justify-between pt-2">
                        <div className="text-[10px] text-muted-foreground font-mono">
                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                <span>
                                    &#8984;
                                </span>
                                Enter
                            </kbd>
                            &nbsp;to submit
                        </div>

                        <div>
                            <Toggle
                                size="sm"
                                variant="outline"
                                aria-label="Enhance prompt"
                                pressed={fixP} // 👈 CONTROL HERE
                                onPressedChange={(next) => {
                                    if (peUsage && !peUsage.allowed) {
                                        toast.error("Upgrade to Pro to use prompt enhance.");
                                        setFixP(false); // 👈 FORCE UNCHECK
                                        return;
                                    }

                                    setFixP(next); // 👈 normal toggle
                                }}
                                className={cn(
                                    "items-center gap-2 px-2 sm:px-3 h-8 text-xs font-medium rounded-md",
                                    "border-muted-foreground/30 text-muted-foreground",
                                    "data-[state=on]:border-blue-500",
                                    "data-[state=on]:text-blue-600",
                                    "data-[state=on]:bg-blue-50",
                                    "dark:data-[state=on]:bg-blue-950/30",
                                    "cursor-target"
                                )}
                            >

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                            <SparklesIcon className="size-3" />
                                            <span className="hidden sm:inline">Enhance Prompt</span>
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent side="top">
                                        Enhance prompt
                                    </TooltipContent>
                                </Tooltip>
                            </Toggle>
                            <span className="ml-4" />
                            <Button
                                disabled={isDisabled}
                                className={
                                    cn("size-8 rounded-full cursor-target", isDisabled && "bg-muted-foreground border")
                                }>

                                {isPending ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <ArrowUpIcon />
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
                <p className="text-center text-muted-foreground text-xs">
                    By prompting Aurix, you are accepting our <span className="text-primary font-bold cursor-target" onClick={() => router.push('/terms')}>terms and conditions</span> and <span className="text-primary font-bold cursor-target" onClick={() => router.push('/privacy')}>privacy policy</span>.
                </p>

                <div className="flex-wrap flex-row justify-center gap-2 hidden md:flex max-w-3xl bg-background/30 border pr-3 pl-3 pt-6 pb-6 rounded-lg lg:mt-12">
                    <span className="text-center font-bold uppercase text-muted-foreground">
                        Aurix Recommandation&apos;s
                    </span>
                    <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl cursor-target">
                        {PROJECT_TEMPLATES.map((template) => (
                            <Button
                                key={template.title}
                                variant="outline"
                                size="sm"
                                className="bg-black/5 dark:bg-sidebar flex items-center gap-2 cursor-pointer"
                                onClick={() => onSelect(template.prompt)}
                            >
                                <span>{template.emoji}</span>
                                <span>{template.title}</span>
                            </Button>

                        ))}
                    </div>
                </div>
            </section>

        </Form >
    )
}