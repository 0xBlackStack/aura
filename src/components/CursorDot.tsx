"use client";

import { useEffect, useRef } from "react";

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // hide system cursor
        document.body.style.cursor = "none";

        const move = (e: MouseEvent) => {
            if (!dotRef.current) return;
            dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        };

        window.addEventListener("mousemove", move);

        return () => {
            document.body.style.cursor = "auto";
            window.removeEventListener("mousemove", move);
        };
    }, []);

    return (
        <div
            ref={dotRef}
            className="
        pointer-events-none fixed left-0 top-0 z-[9999]
        h-4 w-4 rounded-full
        bg-blue-500 dark:bg-blue-400
        opacity-90
        -translate-x-1/2 -translate-y-1/2
        transition-transform duration-100 ease-out
        shadow-[0_0_12px_rgba(59,130,246,0.6)]
      "
        />
    );
};

export default CustomCursor;
