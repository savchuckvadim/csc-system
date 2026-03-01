import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { locales } from "@/i18n";
import { Footer } from "@/modules/widgets/footer/footer";
import { Header } from "@/modules/widgets/header/header";

// Force dynamic rendering to avoid cache conflicts
export const dynamic = "force-dynamic";

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locale || !locales.includes(locale as any)) {
        notFound();
    }

    // Explicitly pass locale to getMessages for reliability
    const messages = await getMessages({ locale });

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="">{children}</main>
                <Footer />
            </div>
        </NextIntlClientProvider>
    );
}
