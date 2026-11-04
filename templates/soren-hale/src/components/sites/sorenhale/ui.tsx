"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";

/* Shared primitives for every Soren Hale section. The CSS lives in src/app/sorenhale.css. */

export const F_D: CSSProperties = { fontFamily: "var(--sh-fd)", fontWeight: 600, letterSpacing: "var(--sh-ls,-.045em)" };

interface SecState {
  on: boolean;
  ph: boolean;
  tb: boolean;
  w: number;
}
const SecCtx = createContext<SecState>({ on: true, ph: false, tb: false, w: 1440 });
export const useSec = () => useContext(SecCtx);

/** Reveal style: fades up once the section is in view. */
export function rv(on: boolean, delay = 0, y = 18): CSSProperties {
  return {
    opacity: on ? 1 : 0,
    translate: on ? "0 0" : `0 ${y}px`,
    transition: `opacity .7s ease ${delay}ms, translate .8s cubic-bezier(.16,.84,.24,1) ${delay}ms`,
  };
}

/** true once nothing holds the page (the loader sets html.sh-hold-*). */
function useReleased() {
  const [free, setFree] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const open = () => !/(^|\s)sh-hold/.test(html.className);
    if (open()) {
      // reads the live html class set by the pre-hydration loader script
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFree(true);
      return;
    }
    const mo = new MutationObserver(() => {
      if (open()) {
        mo.disconnect();
        setFree(true);
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    const t = window.setTimeout(() => {
      mo.disconnect();
      setFree(true);
    }, 9000);
    return () => {
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return free;
}

/** Fires once when the element enters the viewport (and the page is not held by the loader). */
export function useInView(ref: RefObject<Element | null>, threshold = 0.16) {
  const [on, setOn] = useState(false);
  const free = useReleased();
  useEffect(() => {
    const el = ref.current;
    if (!el || !free) return;
    const io = new IntersectionObserver(
      (list) => {
        for (const e of list) {
          if (e.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        }
      },
      { threshold: Math.max(0.005, Math.min(threshold, 80 / Math.max(1, (el as HTMLElement).offsetHeight))) },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, free, threshold]);
  return on;
}

export function bpClass(w: number) {
  const ph = w < 810;
  const tb = !ph && w < 1100;
  return { ph, tb, cls: (ph ? " is-ph" : tb ? " is-tb" : "") + (w < 360 ? " is-xs" : "") };
}

interface SecProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
  children: ReactNode;
  id?: string;
  /** reveal immediately instead of waiting for scroll */
  eager?: boolean;
}

/** Section root: sets `.sh .sh-sec`, the responsive `is-tb/is-ph` classes (measured from its own width) and the reveal flag. */
export function Sec({ as: Tag = "section", className = "", style, threshold = 0.16, children, id, eager }: SecProps) {
  const ref = useRef<HTMLElement>(null);
  const [w, setW] = useState(1440);
  const seen = useInView(ref, threshold);
  const on = eager ? true : seen;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const x = Math.round(el.offsetWidth);
      if (x > 0) setW(x);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const bp = bpClass(w);
  return (
    <SecCtx.Provider value={{ on, ph: bp.ph, tb: bp.tb, w }}>
      <Tag ref={ref} id={id} className={`sh sh-sec ${className}${bp.cls}`} style={style}>
        {children}
      </Tag>
    </SecCtx.Provider>
  );
}

export function Grid({ x = 18, y = 70 }: { x?: number; y?: number }) {
  return <div className="sh-grid" aria-hidden="true" style={{ "--gx": `${x}%`, "--gy": `${y}%` } as CSSProperties} />;
}

export function Eb({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const { on } = useSec();
  const t = text.replace(/^\s*\/\/\s*/, "").trim();
  if (!t) return null;
  return (
    <p className={`sh-eb${on ? " is-on" : ""}${className ? " " + className : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <span aria-hidden="true">{"//"}</span> {t}
    </p>
  );
}

/** Split "Tell me what you are *building.*" into words; `*...*` marks the accent words, `|` a hard line break. */
function words(line: string) {
  const marked = line.replace(/\*([^*]+)\*/g, (_m, t: string) =>
    t
      .trim()
      .split(/\s+/)
      .map((w) => {
        const m = w.match(/^(.*?)([.,!?;:’']*)$/);
        return m && m[1] ? `*${m[1]}*${m[2]}` : w;
      })
      .join(" "),
  );
  return marked
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const m = w.match(/^\*(.+?)\*([.,!?;:’']*)$/);
      return m ? { t: m[1], tail: m[2], acc: true } : { t: w.replace(/\*/g, ""), tail: "", acc: false };
    });
}

export const plain = (s: string) => s.replace(/\*/g, "").replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();

interface HdProps {
  text: string;
  tag?: "h1" | "h2" | "h3";
  size?: string;
  lh?: number;
  delay?: number;
  step?: number;
  className?: string;
  style?: CSSProperties;
}

/** Masked word-by-word headline. */
export function Hd({ text, tag: Tag = "h2", size = "clamp(40px,4.3vw,64px)", lh = 1, delay = 0, step = 45, className = "", style }: HdProps) {
  const { on } = useSec();
  if (!text.trim()) return null;
  let i = 0;
  return (
    <Tag
      className={`sh-hd${on ? " is-on" : ""}${Tag === "h1" ? " is-ssr" : ""}${className ? " " + className : ""}`}
      aria-label={plain(text)}
      style={{ ...F_D, ["--hs" as string]: size, lineHeight: lh, ...style }}
    >
      {text.split("|").map((line, li) => (
        <span className="sh-hd-l" aria-hidden="true" key={li}>
          {words(line).map((w, wi) => {
            const d = delay + i++ * step;
            return (
              <span className="sh-hd-w" key={wi}>
                <span
                  className={`sh-hd-i${w.acc ? " is-acc" : ""}`}
                  style={{ transitionDelay: `${d}ms`, ["--dl" as string]: `${d}ms` }}
                >
                  {w.t}
                  {w.tail}
                </span>{" "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

const ArrowSvg = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const DownSvg = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v13M6 12l6 6 6-6M5 21h14" />
  </svg>
);
export { ArrowSvg, DownSvg };

interface BtnProps {
  href?: string;
  label: string;
  kind?: "solid" | "ghost" | "quiet";
  icon?: "arrow" | "down" | "none";
  className?: string;
  style?: CSSProperties;
  cur?: string;
  onClick?: (e: MouseEvent) => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
}

/** The hero's key button. Links go through next/link when local, plain <a> when external or mailto. */
export function Btn({ href, label, kind = "solid", icon, className = "", style, cur, onClick, type, ariaLabel, disabled }: BtnProps) {
  const ic = kind === "quiet" ? "none" : (icon ?? (kind === "solid" ? "arrow" : "none"));
  const cls = `sh-btn sh-${kind}${ic === "none" ? "" : " has-a"}${className ? " " + className : ""}`;
  const inner = (
    <>
      <span className="sh-btn-l">{label}</span>
      {ic === "none" ? null : (
        <b className={`sh-btn-a is-${ic}`} aria-hidden="true">
          {ic === "down" ? <DownSvg /> : <><ArrowSvg /><ArrowSvg /></>}
        </b>
      )}
    </>
  );
  if (!href) {
    return (
      <button type={type ?? "button"} className={cls} data-cur={cur ?? "go"} onClick={onClick} aria-label={ariaLabel} disabled={disabled} style={style}>
        {inner}
      </button>
    );
  }
  const file = /\.[a-z0-9]+$/i.test(href) && href.startsWith("/");
  if (file || /^(https?:|mailto:|tel:)/.test(href)) {
    const ext = href.startsWith("http");
    return (
      <a className={cls} data-cur={cur ?? "open"} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener" : undefined} download={file || undefined} aria-label={ariaLabel} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={cls} data-cur={cur ?? "open"} href={href} aria-label={ariaLabel} style={style} onClick={onClick}>
      {inner}
    </Link>
  );
}

export function Chip({ t, tone = "", dot = false, className = "" }: { t: string; tone?: "" | "acc" | "mut" | "fill"; dot?: boolean; className?: string }) {
  if (!t.trim()) return null;
  return (
    <span className={`sh-chip${tone ? " is-" + tone : ""}${className ? " " + className : ""}`}>
      {dot ? <i aria-hidden="true" /> : null}
      {t}
    </span>
  );
}

export function Pick({ label, on, onClick, count, cur }: { label: string; on: boolean; onClick: () => void; count?: string | number; cur?: string }) {
  return (
    <button type="button" className={`sh-pick${on ? " is-on" : ""}`} aria-pressed={on} onClick={onClick} data-cur={cur ?? (on ? "picked" : "pick")}>
      {label}
      {count !== undefined && count !== "" ? <em>{count}</em> : null}
    </button>
  );
}

export const Caret = () => <i className="sh-caret" aria-hidden="true" />;

/** The numbered mono link used under section heads ("01  See all work →"). */
export function More({ href, n, label, cur = "open" }: { href: string; n?: string; label: string; cur?: string }) {
  return (
    <Link className="sh-more" href={href} data-cur={cur}>
      {n ? <span className="sh-more-n" aria-hidden="true">{n}</span> : null}
      <span className="sh-more-l">{label}</span>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

/** The image slot's stand-in when a project, post or repo has no picture: its name set large on the template's grid. */
export const Face = ({ text }: { text: string }) => (
  <span className="sh-face" aria-hidden="true">
    <span style={F_D}>{text}</span>
  </span>
);
