"use client";

import { useTranslations } from "next-intl";

import { LoginForm } from "@/modules/features/auth/login/login-form";
import { Card } from "@/modules/shared/ui/card/card";

export default function LoginPage() {
    const t = useTranslations("auth.login");

    return (
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
            <Card
                className="w-full max-w-md"
                title={t("title")}
                description={t("subtitle")}
                headerClassName="text-center"
            >
                <LoginForm />
            </Card>
        </div>
    );
}
