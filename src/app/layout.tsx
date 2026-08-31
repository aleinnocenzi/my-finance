import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getT } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t.brand.name,
    description: t.brand.tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getT();

  return (
    <html lang={locale} className={`dark ${geist.variable}`}>
      <body className="min-h-screen bg-background font-sans text-gray-200 antialiased">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
