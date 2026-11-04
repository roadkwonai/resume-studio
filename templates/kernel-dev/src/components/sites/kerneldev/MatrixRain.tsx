"use client";

import { useEffect, useRef } from "react";

type Props = {
  spacing?: number;
  size?: number;
  speed?: number;
  intensity?: number;
  characters?: string;
  className?: string;
};

// Same algorithm as the source's "Matrix rain" code component (defaults from its property controls).
export function MatrixRain({
  spacing = 30,
  size = 12,
  speed = 0.32,
  intensity = 0.18,
  characters = "01:<>/{}",
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(canvas).color;
      ctx.font = `${size}px monospace`;
      drops.forEach((y, i) => {
        for (let t = 0; t < 7; t++) {
          ctx.globalAlpha = (1 - t / 7) * intensity;
          ctx.fillText(
            characters[(i * 7 + t + Math.floor(y)) % characters.length] || "0",
            i * spacing,
            (y - t) * size,
          );
        }
        drops[i] = y * size > h + 100 ? -10 : y + speed;
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w;
      canvas.height = h;
      drops = Array.from({ length: Math.ceil(w / spacing) }, () => (Math.random() * h) / size);
      draw();
    };

    const tick = (now: number) => {
      if (visible && !document.hidden && !reduced.matches && now - last > 70) {
        draw();
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    resize();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [spacing, size, speed, intensity, characters]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
