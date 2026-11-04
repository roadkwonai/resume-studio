"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { installs, promptGroups, scenarios, steps } from "@/guide";

function Picker({ label, items, value, onPick }: { label: string; items: string[]; value: number; onPick: (index: number) => void }) {
  return (
    <div className="picker" role="group" aria-label={label}>
      {items.map((item, index) => (
        <button key={item} type="button" aria-pressed={index === value} onClick={() => onPick(index)}>
          {item}
        </button>
      ))}
    </div>
  );
}

export function Steps() {
  const [pick, setPick] = useState(0);
  const scenario = scenarios[pick];
  return (
    <>
      <Picker label="상황 선택" items={scenarios.map((s) => s.name)} value={pick} onPick={setPick} />
      <blockquote className="said">{scenario.prompt}</blockquote>
      <ol className="steps">
        {steps.map((step, index) => {
          const work = scenario.work[index];
          return (
            <li key={step} data-skip={work ? undefined : ""}>
              <span className="step-no">{index + 1}</span>
              <h3>{step}</h3>
              <p>{work ?? "이 상황에서는 건너뜁니다."}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function Prompts() {
  const [pick, setPick] = useState(0);
  return (
    <>
      <Picker label="프롬프트 분류" items={promptGroups.map((g) => g.name)} value={pick} onPick={setPick} />
      <ul className="prompts">
        {promptGroups[pick].items.map((item) => (
          <li key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.when}</p>
            <pre tabIndex={0}>{item.text}</pre>
            <CopyButton text={item.text} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function Install() {
  const [pick, setPick] = useState(0);
  const install = installs[pick];
  return (
    <>
      <Picker label="설치 방법" items={installs.map((i) => i.name)} value={pick} onPick={setPick} />
      <p>{install.when}</p>
      <div className="codeblock">
        <pre tabIndex={0}>{install.text}</pre>
        <CopyButton text={install.text} />
      </div>
    </>
  );
}
