"use client";
import { AuthButtons } from "./components/auth-buttons";
import { HeaderActions } from "./components/header-actions";
import { Logo } from "./components/logo";
import { Navigation } from "../navigation/navigation";
import { useTranslations } from "next-intl";

import {
    CommonTranslationKey,
    createTypedTranslation,
    NavigationTranslationKey,
} from "@/modules/shared/config/i18n/types";
import { ROUTES } from "@/modules/shared/config/routes";
import { useLocalizedLink } from "@/modules/shared/lib/use-localized-link";

export function Header() {
    const t = createTypedTranslation<NavigationTranslationKey>(useTranslations("navigation"));
    const tCommon = createTypedTranslation<CommonTranslationKey>(useTranslations("common"));
    const localizedLink = useLocalizedLink();

    const navigationItems = [
        { key: "home" as const, href: localizedLink(ROUTES.HOME), label: t("home") },
        { key: "about" as const, href: localizedLink(ROUTES.ABOUT), label: t("about") },
        { key: "contacts" as const, href: localizedLink(ROUTES.CONTACTS), label: t("contacts") },
    ];

    return (
        <header className="sticky top-0 z-50 w-full flex justify-center border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Logo companyName={tCommon("companyName")} />
                    <Navigation items={navigationItems} />
                </div>
                <div className="flex items-center gap-4">
                    <HeaderActions />
                    <AuthButtons loginLabel={t("login")} registerLabel={t("register")} />
                </div>
            </div>
        </header>
    );
}
