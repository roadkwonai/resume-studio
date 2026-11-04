import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import type { Metadata } from "next";
import { profile } from "@/components/sites/kerneldev/data";
import "./globals.css";

const title = `${profile.basics.name} — ${profile.basics.label}`;
const description = profile.basics.summary;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={profile.locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
