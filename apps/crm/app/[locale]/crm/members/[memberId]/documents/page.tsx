import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Button } from "@workspace/ui";

import {
    getCrmMemberById,
    getIdentityDocumentPreviewUrl,
    getSignaturePreviewUrl,
} from "@/modules/entities/member/api/member.api";

export default async function CrmMemberDocumentsPage({
    params,
}: {
    params: Promise<{ locale: string; memberId: string }>;
}) {
    const { locale, memberId } = await params;
    const t = await getTranslations("crm.members");
    const member = await getCrmMemberById(memberId);

    if (!member) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{t("documentsRouteTitle")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {member.name} {member.surname ?? ""} · {member.email}
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/${locale}/crm/members/${memberId}`}>{t("backToProfile")}</Link>
                </Button>
            </div>

            <section className="rounded-lg border bg-background p-4">
                <h2 className="mb-3 text-base font-medium">{t("identityDocuments")}</h2>
                <div className="space-y-2 text-sm">
                    {member.identityDocuments.length > 0 ? (
                        member.identityDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="rounded-md border p-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-medium">
                                        {doc.type} · {doc.side}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{doc.id}</span>
                                </div>
                                <p className="mt-2 break-all text-xs text-muted-foreground">
                                    {t("storagePath")}: {doc.storagePath}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t("uploadedAt")}: {new Date(doc.createdAt).toLocaleString()}
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/${locale}/crm/members/${memberId}/documents/${doc.id}`}>
                                            {t("openDocument")}
                                        </Link>
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={getIdentityDocumentPreviewUrl(memberId, doc.id)} target="_blank">
                                            {t("openInNewTab")}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">{t("noIdentityDocuments")}</p>
                    )}
                </div>
            </section>

            <section className="rounded-lg border bg-background p-4">
                <h2 className="mb-3 text-base font-medium">{t("signatureTitle")}</h2>
                {member.signature ? (
                    <div className="rounded-md border p-3 text-sm">
                        <p className="text-xs text-muted-foreground">{member.signature.id}</p>
                        <p className="mt-2 break-all text-xs text-muted-foreground">
                            {t("storagePath")}: {member.signature.storagePath}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t("uploadedAt")}: {new Date(member.signature.createdAt).toLocaleString()}
                        </p>
                        <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                                <Link href={`/${locale}/crm/members/${memberId}/documents/signature`}>
                                    {t("openDocument")}
                                </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                                <a href={getSignaturePreviewUrl(memberId)} target="_blank">
                                    {t("openInNewTab")}
                                </a>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">{t("noSignature")}</p>
                )}
            </section>
        </div>
    );
}
