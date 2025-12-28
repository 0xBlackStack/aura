"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="flex h-full min-h-[60vh] items-center justify-center p-6">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-center">
                <p className="text-sm font-medium text-red-400">
                    Something went wrong.
                </p>

                <button
                    onClick={reset}
                    className="mt-3 text-xs underline"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
