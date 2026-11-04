"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { BASE, templates } from "@/templates";
import { useSelection } from "@/useSelection";
import shots from "@/shots.json";

const WINDOW_RATIO = 2; // strip height / width, see .strip-window
const SCREEN = 900; // the viewport the shots were taken at

export function Sheet() {
  const [selected] = useSelection();
  const chosen = templates.find((t) => t.id === selected);

  return (
    <>
      {chosen ? (
        <p className="current">
          선택한 템플릿: <Link href={`/preview/${chosen.id}`}>{chosen.name}</Link>
        </p>
      ) : null}
      <ol className="sheet">
        {templates.map((t) => {
          const shot = (shots as Record<string, { width: number; height: number }>)[t.id];
          const travel = shot ? Math.max(0, 100 - (WINDOW_RATIO * shot.width * 100) / shot.height) : 0;
          const rest = (t.start ?? 0) * 100;
          return (
            <li key={t.id} className="strip" data-picked={selected === t.id ? "" : undefined}>
              <Link href={`/preview/${t.id}`} className="strip-link" aria-label={`${t.name} 미리보기 열기`}>
                <span className="strip-window">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${BASE}/shots/${t.id}.jpg`}
                    alt=""
                    width={shot?.width}
                    height={shot?.height}
                    style={{ "--rest": `-${rest}%`, "--travel": `-${travel.toFixed(2)}%`, "--pan": `${Math.round((shot?.height ?? 6000) / 700)}s` } as React.CSSProperties}
                  />
                </span>
                <span className="strip-no">{t.no}</span>
                <span className="strip-name">{t.name}</span>
                <span className="strip-tone">{t.tone}</span>
                {shot ? <span className="strip-length">페이지 길이: 약 {Math.round(shot.height / SCREEN)}화면</span> : null}
              </Link>
              {selected === t.id ? (
                <p className="strip-picked">
                  <Check size={16} aria-hidden="true" />
                  선택됨
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}
