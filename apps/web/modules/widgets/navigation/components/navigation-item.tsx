"use client";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";


interface NavigationItemProps {

    href: string;
    label: string;
    isActive: boolean;
}



export function NavigationItem({ href, label, isActive }: NavigationItemProps) {

 

    return (
        <li >
            <Link
                href={href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60",
                    isActive && "text-foreground",
                    !isActive && "text-foreground/60"
                )}
            >
                {label}
            </Link>
        </li>
    );
}
