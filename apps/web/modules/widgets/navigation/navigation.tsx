"use client";
import { NavigationTranslationKey } from "@/modules/shared/config/i18n/types";
import { usePathname } from "next/navigation";
import { NavigationItem } from "./components/navigation-item";

interface NavigationItem {
    key: NavigationTranslationKey;
    href: string;
    label: string;
}

interface NavigationProps {
    items: NavigationItem[];
}

export function Navigation({ items }: NavigationProps) {
    const pathname = usePathname();

    return (
        <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex items-center gap-6">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <NavigationItem
                            key={item.key}
                            href={item.href}
                            label={item.label}
                            isActive={isActive}
                        />
                    );
                })}
            </ul>
        </nav>
    );
}
