"use client";

import { useSyncExternalStore } from "react";

export type Bp = "desktop" | "tablet" | "phone";

const subscribe = (cb: () => void) => {
  const a = window.matchMedia("(max-width: 1199px)");
  const b = window.matchMedia("(max-width: 809px)");
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
};
const snap = (): Bp => (window.matchMedia("(max-width: 809px)").matches ? "phone" : window.matchMedia("(max-width: 1199px)").matches ? "tablet" : "desktop");

/** Same breakpoints as the Framer source: tablet below 1200, phone below 810. */
export function useBp(): Bp {
  return useSyncExternalStore(subscribe, snap, () => "desktop");
}
