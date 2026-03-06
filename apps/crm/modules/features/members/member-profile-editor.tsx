"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button, FieldInput } from "@workspace/ui";
import { Field, FieldContent, FieldLabel } from "@workspace/ui/components/field";

import {
    CrmMemberDetails,
    updateCrmMember,
    updateCrmMemberFiles,
} from "@/modules/entities/member/api/member.api";

interface MemberProfileEditorProps {
    member: CrmMemberDetails;
}

export function MemberProfileEditor({ member }: MemberProfileEditorProps) {
    const t = useTranslations("crm.members.editor");
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const initialStatuses = useMemo(
        () => ({
            isMedical: member.mjStatuses.some((status) => status.code === "medical"),
            isMj: member.mjStatuses.some((status) => status.code === "mj"),
            isRecreation: member.mjStatuses.some((status) => status.code === "recreation"),
        }),
        [member.mjStatuses]
    );

    const [profileForm, setProfileForm] = useState({
        name: member.name,
        surname: member.surname ?? "",
        phone: member.phone ?? "",
        birthday: member.birthday ? member.birthday.slice(0, 10) : "",
        membershipNumber: member.membershipNumber ?? "",
        address: member.address ?? "",
        status: member.status,
        notes: member.notes ?? "",
        documentType: member.documents[0]?.type ?? "",
        documentNumber: member.documents[0]?.number ?? "",
        ...initialStatuses,
    });

    const [filesForm, setFilesForm] = useState<{
        documentType: string;
        documentFirst: File | null;
        documentSecond: File | null;
        signature: File | null;
    }>({
        documentType: member.documents[0]?.type ?? "passport",
        documentFirst: null,
        documentSecond: null,
        signature: null,
    });

    const handleProfileSave = async () => {
        setError(null);
        setSuccess(null);
        setIsSaving(true);
        try {
            await updateCrmMember(member.id, {
                name: profileForm.name,
                surname: profileForm.surname || undefined,
                phone: profileForm.phone || undefined,
                birthday: profileForm.birthday || undefined,
                membershipNumber: profileForm.membershipNumber || undefined,
                address: profileForm.address || undefined,
                status: profileForm.status || undefined,
                notes: profileForm.notes || undefined,
                isMedical: profileForm.isMedical,
                isMj: profileForm.isMj,
                isRecreation: profileForm.isRecreation,
                documentType: profileForm.documentType || undefined,
                documentNumber: profileForm.documentNumber || undefined,
            });
            setSuccess(t("profileSaved"));
            router.refresh();
        } catch {
            setError(t("saveError"));
        } finally {
            setIsSaving(false);
        }
    };

    const fileToDataUrl = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("file read failed"));
            reader.readAsDataURL(file);
        });

    const handleFileUpload = async () => {
        if (!filesForm.documentFirst && !filesForm.documentSecond && !filesForm.signature) {
            return;
        }
        setError(null);
        setSuccess(null);
        setIsUploading(true);
        try {
            await updateCrmMemberFiles(member.id, {
                documentType: filesForm.documentType || undefined,
                documentFirst: filesForm.documentFirst
                    ? await fileToDataUrl(filesForm.documentFirst)
                    : undefined,
                documentSecond: filesForm.documentSecond
                    ? await fileToDataUrl(filesForm.documentSecond)
                    : undefined,
                signature: filesForm.signature ? await fileToDataUrl(filesForm.signature) : undefined,
            });
            setSuccess(t("filesUploaded"));
            setFilesForm((prev) => ({
                ...prev,
                documentFirst: null,
                documentSecond: null,
                signature: null,
            }));
            router.refresh();
        } catch {
            setError(t("uploadError"));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-4 text-base font-medium">{t("title")}</h2>
            <div className="grid gap-3 md:grid-cols-2">
                <FieldInput
                    label={t("fields.name")}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <FieldInput
                    label={t("fields.surname")}
                    value={profileForm.surname}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, surname: e.target.value }))}
                />
                <FieldInput
                    label={t("fields.phone")}
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
                <FieldInput
                    label={t("fields.birthday")}
                    type="date"
                    value={profileForm.birthday}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, birthday: e.target.value }))}
                />
                <FieldInput
                    label={t("fields.membershipNumber")}
                    value={profileForm.membershipNumber}
                    onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, membershipNumber: e.target.value }))
                    }
                />
                <FieldInput
                    label={t("fields.status")}
                    value={profileForm.status}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, status: e.target.value }))}
                />
                <FieldInput
                    label={t("fields.documentType")}
                    value={profileForm.documentType}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, documentType: e.target.value }))}
                />
                <FieldInput
                    label={t("fields.documentNumber")}
                    value={profileForm.documentNumber}
                    onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, documentNumber: e.target.value }))
                    }
                />
            </div>

            <div className="mt-3">
                <FieldInput
                    label={t("fields.address")}
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                />
            </div>

            <div className="mt-3">
                <label className="mb-1 block text-sm font-medium">{t("fields.notes")}</label>
                <textarea
                    className="w-full rounded-md border bg-background p-2 text-sm"
                    rows={3}
                    value={profileForm.notes}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={profileForm.isMedical}
                        onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, isMedical: e.target.checked }))
                        }
                    />
                    {t("fields.isMedical")}
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={profileForm.isMj}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, isMj: e.target.checked }))}
                    />
                    {t("fields.isMj")}
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={profileForm.isRecreation}
                        onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, isRecreation: e.target.checked }))
                        }
                    />
                    {t("fields.isRecreation")}
                </label>
            </div>

            <div className="mt-4 flex gap-2">
                <Button onClick={handleProfileSave} disabled={isSaving}>
                    {isSaving ? t("saving") : t("saveProfile")}
                </Button>
            </div>

            <div className="mt-6 border-t pt-4">
                <h3 className="mb-3 text-sm font-medium">{t("filesTitle")}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                    <FieldInput
                        label={t("fields.documentType")}
                        value={filesForm.documentType}
                        onChange={(e) =>
                            setFilesForm((prev) => ({ ...prev, documentType: e.target.value }))
                        }
                    />
                    <Field className="md:col-span-2">
                        <FieldLabel>{t("fields.documentFirst")}</FieldLabel>
                        <FieldContent>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFilesForm((prev) => ({
                                        ...prev,
                                        documentFirst: e.target.files?.[0] ?? null,
                                    }))
                                }
                            />
                        </FieldContent>
                    </Field>
                    <Field className="md:col-span-2">
                        <FieldLabel>{t("fields.documentSecond")}</FieldLabel>
                        <FieldContent>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFilesForm((prev) => ({
                                        ...prev,
                                        documentSecond: e.target.files?.[0] ?? null,
                                    }))
                                }
                            />
                        </FieldContent>
                    </Field>
                    <Field className="md:col-span-2">
                        <FieldLabel>{t("fields.signature")}</FieldLabel>
                        <FieldContent>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFilesForm((prev) => ({
                                        ...prev,
                                        signature: e.target.files?.[0] ?? null,
                                    }))
                                }
                            />
                        </FieldContent>
                    </Field>
                </div>
                <div className="mt-4">
                    <Button variant="outline" onClick={handleFileUpload} disabled={isUploading}>
                        {isUploading ? t("uploading") : t("uploadFiles")}
                    </Button>
                </div>
            </div>

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
        </section>
    );
}
