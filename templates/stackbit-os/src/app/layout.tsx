import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import type { Metadata } from "next";
import { PAGE_TITLE, profile } from "@/components/sites/stackbitos/data";
import "./globals.css";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: profile.basics.summary,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={profile.locale}
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full bg-[#080a0b]">{children}</body>
    </html>
  );
}
