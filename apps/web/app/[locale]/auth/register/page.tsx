"use client";

import { useTranslations } from "next-intl";

import { RegistrationForm } from "@/modules/features/auth/register/registration-form";
import { Card } from "@/modules/shared/ui/card/card";

export default function RegisterPage() {
    const t = useTranslations("auth.register");

    return (
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
            <Card
                className="w-full max-w-4xl"
                title={t("title")}
                description={t("subtitle")}
                headerClassName="text-center"
            >
                <RegistrationForm />
            </Card>
        </div>
    );
}
