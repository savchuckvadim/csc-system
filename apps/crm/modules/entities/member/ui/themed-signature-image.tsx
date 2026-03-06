"use client";

import { useTheme } from "next-themes";

interface ThemedSignatureImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function ThemedSignatureImage({ src, alt, className }: ThemedSignatureImageProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={isDark ? { filter: "invert(1)" } : undefined}
        />
    );
}
