"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@workspace/ui/components/button";
import { Field, FieldContent, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";

import { ROUTES } from "@/modules/shared/config/routes";
import { apiClient } from "@/modules/shared/lib/api";
import { useLocalizedLink } from "@/modules/shared/lib/use-localized-link";
import { FieldInput } from "@/modules/shared/ui/field/field";
import { FileUpload } from "@/modules/shared/ui/file-upload/file-upload";
import { SignatureCanvasField } from "@/modules/shared/ui/signature-canvas/signature-canvas";

const registrationSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        surname: z.string().min(2, "Surname must be at least 2 characters"),
        email: z.string().email("Invalid email"),
        phone: z.string().min(10, "Phone must be at least 10 characters"),
        birthday: z.string().min(1, "Birthday is required"),
        documentType: z.string().min(1, "Document type is required"),
        documentNumber: z.string().min(1, "Document number is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        repeatPassword: z.string(),
        isMedical: z.boolean().default(false),
        isRecreation: z.boolean().default(false),
        isMj: z.boolean().default(false),
        documentFirst: z.instanceof(File).optional(),
        documentSecond: z.instanceof(File).optional(),
        signature: z.string().min(1, "Signature is required"),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords don't match",
        path: ["repeatPassword"],
    })
    .refine((data) => data.isMedical || data.isRecreation, {
        message: "Specify the type of consumption",
        path: ["isMedical"],
    });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
    const t = useTranslations("auth.register");
    const localizedLink = useLocalizedLink();
    const [documentFirst, setDocumentFirst] = useState<File | null>(null);
    const [documentSecond, setDocumentSecond] = useState<File | null>(null);
    const [signature, setSignature] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            isMedical: false,
            isRecreation: false,
            isMj: false,
        },
    });

    const isMedical = watch("isMedical");
    const isRecreation = watch("isRecreation");

    const mutation = useMutation({
        mutationFn: async (data: RegistrationFormData) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === "boolean") {
                    formData.append(key, value.toString());
                } else if (value) {
                    formData.append(key, value);
                }
            });
            // TODO: Replace with actual API call
            const response = await apiClient.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        },
        onSuccess: () => {
            // TODO: Handle success (redirect, etc.)
            console.log("Registration successful");
        },
        onError: (error) => {
            console.error("Registration error:", error);
        },
    });

    const onSubmit = (data: RegistrationFormData) => {
        if (documentFirst) setValue("documentFirst", documentFirst);
        if (documentSecond) setValue("documentSecond", documentSecond);
        if (signature) setValue("signature", signature);
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {mutation.isError && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                    {t("error") || "Registration failed. Please try again."}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <FieldInput
                    label={t("name")}
                    type="text"
                    error={errors.name?.message}
                    required
                    {...register("name")}
                    placeholder="John"
                />

                <FieldInput
                    label={t("surname")}
                    type="text"
                    error={errors.surname?.message}
                    required
                    {...register("surname")}
                    placeholder="Doe"
                />
            </div>

            <FieldInput
                label={t("email")}
                type="email"
                error={errors.email?.message}
                required
                {...register("email")}
                placeholder="your.email@example.com"
            />

            <div className="grid gap-4 md:grid-cols-2">
                <FieldInput
                    label={t("phone")}
                    type="tel"
                    error={errors.phone?.message}
                    required
                    {...register("phone")}
                    placeholder="+1234567890"
                />

                <FieldInput
                    label={t("birthday")}
                    type="date"
                    error={errors.birthday?.message}
                    required
                    {...register("birthday")}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FieldInput
                    label={t("documentType")}
                    type="text"
                    error={errors.documentType?.message}
                    required
                    {...register("documentType")}
                    placeholder="Passport"
                />

                <FieldInput
                    label={t("documentNumber")}
                    type="text"
                    error={errors.documentNumber?.message}
                    required
                    {...register("documentNumber")}
                    placeholder="123456789"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FileUpload
                    label={t("documentFirst")}
                    value={documentFirst}
                    onChange={(file) => {
                        setDocumentFirst(file);
                        if (file) setValue("documentFirst", file);
                    }}
                    error={errors.documentFirst?.message}
                    required
                    accept="image/*"
                />

                <FileUpload
                    label={t("documentSecond")}
                    value={documentSecond}
                    onChange={(file) => {
                        setDocumentSecond(file);
                        if (file) setValue("documentSecond", file);
                    }}
                    error={errors.documentSecond?.message}
                    required
                    accept="image/*"
                />
            </div>

            <Field>
                <FieldLabel>{t("signature")}</FieldLabel>
                <FieldContent>
                    <SignatureCanvasField
                        value={signature || undefined}
                        onChange={(value) => {
                            setSignature(value);
                            if (value) setValue("signature", value);
                        }}
                        error={!!errors.signature}
                    />
                    {errors.signature && (
                        <p className="text-sm text-destructive">{errors.signature.message}</p>
                    )}
                </FieldContent>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
                <FieldInput
                    label={t("password")}
                    type="password"
                    error={errors.password?.message}
                    required
                    {...register("password")}
                    placeholder="••••••••"
                />

                <FieldInput
                    label={t("repeatPassword")}
                    type="password"
                    error={errors.repeatPassword?.message}
                    required
                    {...register("repeatPassword")}
                    placeholder="••••••••"
                />
            </div>

            <Field>
                <FieldLabel>{t("isMj")}</FieldLabel>
                <FieldContent>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("isMedical")}
                                className="rounded border-input"
                            />
                            <span className="text-sm">{t("isMedical")}</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("isRecreation")}
                                className="rounded border-input"
                            />
                            <span className="text-sm">{t("isRecreation")}</span>
                        </label>
                        {errors.isMedical && (
                            <p className="text-sm text-destructive">{errors.isMedical.message}</p>
                        )}
                    </div>
                </FieldContent>
            </Field>

            <Button type="submit" className="w-full" disabled={isSubmitting || mutation.isPending}>
                {isSubmitting || mutation.isPending ? t("submitting") : t("submit")}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                {t("privacy")}{" "}
                <Link href={localizedLink(ROUTES.TERMS)} className="text-primary hover:underline">
                    {t("terms")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href={localizedLink(ROUTES.PRIVACY)} className="text-primary hover:underline">
                    {t("privacyPolicy")}
                </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                {t("hasAccount")}{" "}
                <Link href={localizedLink(ROUTES.LOGIN)} className="text-primary hover:underline">
                    {t("login")}
                </Link>
            </div>
        </form>
    );
}
