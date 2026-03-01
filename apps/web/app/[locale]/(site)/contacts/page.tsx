"use client";

import { useTranslations } from "next-intl";

import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import { FieldInput } from "@/modules/shared/ui/field/field";

export default function ContactsPage() {
    const t = useTranslations("contacts");

    return (
        <div className="container py-20">
            <div className="mx-auto max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
                    <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Mail className="size-5 text-primary" />
                                <h3 className="text-lg font-semibold">{t("email")}</h3>
                            </div>
                            <p className="text-muted-foreground">
                                <a
                                    href={`mailto:${t("emailValue")}`}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t("emailValue")}
                                </a>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Phone className="size-5 text-primary" />
                                <h3 className="text-lg font-semibold">{t("phone")}</h3>
                            </div>
                            <p className="text-muted-foreground">
                                <a
                                    href={`tel:${t("phoneValue")}`}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t("phoneValue")}
                                </a>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <MapPin className="size-5 text-primary" />
                                <h3 className="text-lg font-semibold">{t("address")}</h3>
                            </div>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {t("addressValue")}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t("sendMessage")}</h3>
                        <form className="space-y-4">
                            <FieldInput label={t("name")} type="text" placeholder={t("name")} />
                            <FieldInput
                                label={t("email")}
                                type="email"
                                placeholder="your.email@example.com"
                            />
                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium leading-none"
                                >
                                    {t("message")}
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={t("message")}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {t("send")}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
