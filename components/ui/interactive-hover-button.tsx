import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: React.ReactNode;
    showDot?: boolean;
}

const InteractiveHoverButton = React.forwardRef<
    HTMLButtonElement,
    InteractiveHoverButtonProps
>(({ text = "Button", showDot = true, className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "group/interactive relative w-auto min-w-32 cursor-pointer overflow-hidden rounded-full border border-red-500 bg-white p-2 px-6 text-center font-semibold flex items-center justify-center",
                className,
            )}
            {...props}
        >
            <span className="inline-block translate-x-1 transition-all duration-300 group-hover/interactive:translate-x-12 group-hover/interactive:opacity-0 text-red-700">
                {text}
            </span>
            <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover/interactive:-translate-x-1 group-hover/interactive:opacity-100">
                <span>{text}</span>
                <ArrowRight className="w-4 h-4" />
            </div>
            <div className={`absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-red-500 transition-all duration-300 group-hover/interactive:left-[0%] group-hover/interactive:top-[0%] group-hover/interactive:h-full group-hover/interactive:w-full group-hover/interactive:scale-[1.8] group-hover/interactive:bg-red-500 ${!showDot ? "hidden group-hover/interactive:block" : ""}`}></div>
        </button>
    );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
