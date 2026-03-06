import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Button } from "@workspace/ui";

import {
    getCrmMemberById,
    getIdentityDocumentPreviewUrl,
    getSignaturePreviewUrl,
} from "@/modules/entities/member/api/member.api";

export default async function CrmMemberDocumentPreviewPage({
    params,
}: {
    params: Promise<{ locale: string; memberId: string; documentId: string }>;
}) {
    const { locale, memberId, documentId } = await params;
    const t = await getTranslations("crm.members");
    const member = await getCrmMemberById(memberId);

    if (!member) {
        notFound();
    }

    const isSignature = documentId === "signature";
    const identityDocument = member.identityDocuments.find((doc) => doc.id === documentId);

    if (!isSignature && !identityDocument) {
        notFound();
    }
    if (isSignature && !member.signature) {
        notFound();
    }

    const previewUrl = isSignature
        ? getSignaturePreviewUrl(memberId)
        : getIdentityDocumentPreviewUrl(memberId, identityDocument!.id);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">{t("singleDocumentPreviewTitle")}</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/${locale}/crm/members/${memberId}/documents`}>{t("backToDocuments")}</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={previewUrl} target="_blank">
                            {t("openInNewTab")}
                        </a>
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-background p-4">
                <img
                    src={previewUrl}
                    alt={isSignature ? "signature" : `${identityDocument?.type}-${identityDocument?.side}`}
                    className="mx-auto max-h-[70vh] w-auto rounded-md object-contain"
                />
            </div>
        </div>
    );
}
