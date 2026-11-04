"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import { CopyButton } from "@/app/CopyButton";
import { IS_PUBLIC, previewUrl, type Template } from "@/templates";
import { useSelection } from "@/useSelection";

export type Device = "desktop" | "tablet" | "phone";

const DEVICE_LABELS: [Device, string, LucideIcon][] = [
  ["desktop", "데스크톱", Monitor],
  ["tablet", "태블릿", Tablet],
  ["phone", "휴대폰", Smartphone],
];

type Stage = "loading" | "ready" | "down";

export function Preview({
  template,
  templates,
}: {
  template: Template;
  templates: Template[];
}) {
  const param = useSearchParams().get("d");
  const device = DEVICE_LABELS.find(([value]) => value === param)?.[0] ?? "desktop";
  const [stage, setStage] = useState<Stage>("loading");
  const [saved, setSaved] = useSelection();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = previewUrl(template);
  const prompt = `${template.name} 템플릿으로 내 이력서 포트폴리오를 만들어 줘`;

  useEffect(() => {
    if (IS_PUBLIC) return;
    let live = true;
    // no-cors still rejects when nothing is listening on the port, which an iframe alone cannot report.
    fetch(url, { mode: "no-cors" }).catch(() => {
      if (live) setStage("down");
    });
    return () => {
      live = false;
    };
  }, [url]);

  async function choose() {
    setSaving(true);
    setFailed(false);
    const response = await fetch("/api/selection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: template.id }),
    }).catch(() => null);
    setSaving(false);
    if (response?.ok) setSaved(template.id);
    else setFailed(true);
  }

  return (
    <div className="bench">
      <header className="bar">
        <Link href="/" className="wordmark" aria-label="템플릿 목록으로 돌아가기">
          이력서 템플릿
        </Link>
        <nav className="tabs" aria-label="템플릿">
          {templates.map((t) => (
            <Link key={t.id} href={`/preview/${t.id}?d=${device}`} aria-current={t.id === template.id ? "page" : undefined}>
              {t.name}
            </Link>
          ))}
        </nav>
        <nav className="devices" aria-label="화면 크기">
          {DEVICE_LABELS.map(([value, label, Icon]) => (
            <Link key={value} href={`/preview/${template.id}?d=${value}`} aria-current={value === device ? "true" : undefined}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="work">
        <main className="stage" data-device={device}>
          {stage === "down" ? (
            <div className="notice">
              <h2>{template.name} 서버가 실행되고 있지 않습니다</h2>
              <p>
                <code>resume-studio</code> 폴더에서 <code>npm run studio</code>를 실행한 뒤 페이지를 새로 고치세요.
              </p>
            </div>
          ) : (
            <>
              {stage === "loading" ? <div className="skeleton" aria-hidden="true" /> : null}
              <iframe key={template.id} title={`${template.name} 미리보기`} src={url} onLoad={() => setStage("ready")} />
            </>
          )}
        </main>

        <aside className="facts">
          <h1>{template.name}</h1>
          <p className="facts-tone">{template.blurb}</p>
          <dl>
            <dt>추천 대상</dt>
            <dd>{template.fit}</dd>
            <dt>구성</dt>
            <dd>{template.pages}</dd>
            <dt>색상</dt>
            <dd>{template.palette}</dd>
            <dt>준비 자료</dt>
            <dd>{template.needs}</dd>
          </dl>

          {IS_PUBLIC || saved === template.id ? (
            <div className="next" role="status">
              <p>
                {IS_PUBLIC ? (
                  <>
                    <Link href="/#install">설치</Link>를 마친 뒤 AI에 아래 문장을 보내면 포트폴리오 제작을 시작합니다.
                  </>
                ) : (
                  "템플릿을 선택했습니다. AI에 아래 문장을 보내면 포트폴리오 제작을 시작합니다."
                )}
              </p>
              <blockquote>{prompt}</blockquote>
              <CopyButton text={prompt} label="문장 복사" className="quiet" />
            </div>
          ) : (
            <button type="button" className="primary" onClick={choose} disabled={saving} aria-busy={saving}>
              <Check size={18} aria-hidden="true" />
              {saving ? "저장 중" : "이 템플릿 선택"}
            </button>
          )}
          {failed ? <p className="error" role="alert">저장하지 못했습니다. 서버가 실행 중인지 확인한 뒤 다시 시도하세요.</p> : null}
          <a className="out" href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={16} aria-hidden="true" />
            새 탭에서 열기
          </a>
        </aside>
      </div>
    </div>
  );
}
