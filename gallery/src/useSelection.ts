"use client";

import { useEffect, useState } from "react";
import { IS_PUBLIC } from "@/templates";

export function useSelection() {
  const state = useState<string | null>(null);
  const setSelected = state[1];

  useEffect(() => {
    if (IS_PUBLIC) return;
    fetch("/api/selection")
      .then((response) => response.json())
      .then((body: { template: string | null }) => setSelected(body.template))
      .catch(() => {});
  }, [setSelected]);

  return state;
}
