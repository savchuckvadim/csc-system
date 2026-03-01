import Link from "next/link";

import { NavigationTranslationKey } from "@/modules/shared/config/i18n/types";

interface NavigationItem {
    key: NavigationTranslationKey;
    href: string;
    label: string;
}

interface NavigationProps {
    items: NavigationItem[];
}

export function Navigation({ items }: NavigationProps) {
    return (
        <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex items-center gap-6">
                {items.map((item) => (
                    <li key={item.key}>
                        <Link
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
