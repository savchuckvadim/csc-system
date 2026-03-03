"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { Check, X } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export interface SignatureCanvasProps {
    value?: string;
    onChange?: (value: string | null) => void;
    error?: boolean;
    className?: string;
    placeholder?: string;
    penColor?: string;
}

export function SignatureCanvasField({
    value,
    onChange,
    error,
    className,
    placeholder = "Your signature",
    penColor,
}: SignatureCanvasProps) {
    const canvasRef = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const { resolvedTheme } = useTheme();
    const effectivePenColor = penColor ?? (resolvedTheme === "dark" ? "#f8fafc" : "#111827");

    useEffect(() => {
        if (canvasRef.current) {
            setIsEmpty(canvasRef.current.isEmpty());
        }
    }, [value]);

    const handleClear = () => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            setIsEmpty(true);
            onChange?.(null);
        }
    };

    const handleSave = () => {
        if (canvasRef.current && !canvasRef.current.isEmpty()) {
            const dataURL = canvasRef.current.getTrimmedCanvas().toDataURL("image/png");
            setIsEmpty(false);
            onChange?.(dataURL);
        }
    };

    const handleEnd = () => {
        if (canvasRef.current && !canvasRef.current.isEmpty()) {
            handleSave();
        }
    };

    return (
        <div className={cn("space-y-2 ", className)}>
            <div
                className={cn(
                    "relative rounded-md border",
                    error ? "border-destructive" : value ? "border-green-500" : "border-input",
                    "bg-background"
                )}
            >
                {!value && isEmpty && (
                    <span className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground ">
                        {placeholder}
                    </span>
                )}
                <SignatureCanvas
                    ref={canvasRef}
                    penColor={effectivePenColor}
                    canvasProps={{
                        className: "w-full h-48 cursor-crosshair rounded-xl",
                    }}
                    onEnd={handleEnd}
                />
                {value && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                        <Check className="size-8 text-green-500" />
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="flex-1"
                >
                    <X className="mr-2 size-4" />
                    Clear
                </Button>
                {/* {isEmpty && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        className="flex-1"
                    >
                        <Check className="mr-2 size-4" />
                        Save
                    </Button>
                )} */}
            </div>
        </div>
    );
}
