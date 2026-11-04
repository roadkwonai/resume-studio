"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "복사", className = "copy" }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");

  async function copy() {
    const ok = await navigator.clipboard.writeText(text).then(() => true, () => false);
    setState(ok ? "done" : "failed");
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {state === "done" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">{state === "done" ? "복사됨" : state === "failed" ? "복사 실패" : label}</span>
    </button>
  );
}
