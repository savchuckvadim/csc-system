import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@workspace/ui";

import { getCrmMembers } from "@/modules/entities/member/api/member.api";

export default async function CrmMembersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("crm.members");
    const members = await getCrmMembers(200);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{t("title")}</h1>
                    <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
                <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                    {t("total", { count: members.length })}
                </span>
            </div>

            <div className="overflow-hidden rounded-lg border bg-background">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-medium">{t("columns.name")}</th>
                            <th className="px-4 py-3 font-medium">{t("columns.email")}</th>
                            <th className="px-4 py-3 font-medium">{t("columns.phone")}</th>
                            <th className="px-4 py-3 font-medium">{t("columns.status")}</th>
                            <th className="px-4 py-3 font-medium text-right">{t("columns.action")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="border-t">
                                <td className="px-4 py-3">
                                    {member.name} {member.surname ?? ""}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {member.phone ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/${locale}/crm/members/${member.id}`}>
                                            {t("openProfile")}
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
