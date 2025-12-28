"use client";

import { useEffect, useRef } from "react";
import { trpc } from "@/trpc/react";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { Fragment } from "@/generated/prisma/client";
import { MessageLoading } from "./message-loading";

interface Props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessageContainer = ({
    projectId,
    activeFragment,
    setActiveFragment,
}: Props) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastAssistantMessageIdRef = useRef<string | null>(null);

    // 👇 suspense tuple
    const [data] = trpc.messages.getMany.useSuspenseQuery(
        { projectId },
        { refetchInterval: 2000 }
    );

    // ✅ GUARANTEE ARRAY
    const messages = Array.isArray(data) ? data : [];

    useEffect(() => {
        const lastAssistantMessage = [...messages]
            .reverse()
            .find((message) => message.role === "ASSISTANT");

        if (
            lastAssistantMessage?.fragment &&
            lastAssistantMessage.id !== lastAssistantMessageIdRef.current
        ) {
            setActiveFragment(lastAssistantMessage.fragment);
            lastAssistantMessageIdRef.current = lastAssistantMessage.id;
        }
    }, [messages, setActiveFragment]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage?.role === "USER";

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    {messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            content={message.content}
                            role={message.role}
                            fragment={message.fragment}
                            createdAt={message.createdAt}
                            isActive={activeFragment?.id === message.fragment?.id}
                            onFragmentClick={() =>
                                setActiveFragment(message.fragment)
                            }
                            type={message.type}
                        />
                    ))}

                    {isLastMessageUser && <MessageLoading />}
                    <div ref={bottomRef} />
                </div>
            </div>

            <div className="relative p-3 pt-1">
                <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background/70 pointer-events-none" />
                <MessageForm projectId={projectId} />
            </div>
        </div>
    );
};
