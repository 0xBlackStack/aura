"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    console.error("Global error:", error);
    return (
        <div className="relative overflow-hidden bg-black text-white ">
            {/* 🔮 Animated glow background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/30 blur-[120px] animate-glow" />
                <div className="absolute bottom-[-150px] right-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[120px] animate-glow-delay" />
            </div>

            {/* 🧠 Error content */}
            <div className="relative z-10 flex h-screen w-screen items-center justify-center text-center">
                <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Something broke 🫠
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        The app hit an unexpected error.
                        This is not your fault. Probably.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
}
