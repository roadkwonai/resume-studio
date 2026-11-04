import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Resume Studio | 이력서를 웹사이트로",
  description: "이력서 포트폴리오 템플릿 5종을 비교하고, resume-portfolio 스킬로 내 이력서를 웹사이트로 만듭니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
