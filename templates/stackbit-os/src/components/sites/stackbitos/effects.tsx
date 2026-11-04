"use client";

import { useEffect, useRef, useState } from "react";
import { geoDistance, geoEquirectangular, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeoPermissibleObjects } from "d3-geo";
import type { Topology } from "topojson-specification";
import * as THREE from "three";
import styles from "./stackbit.module.css";

// The source shader was authored against three r128, which had no colour management.
THREE.ColorManagement.enabled = false;

const GREEN = "rgb(82, 179, 131)";
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

const SPACING = 60;
const PROXIMITY = 150;
const BASE_OPACITY = 0.15;

export function GridBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let size = fitCanvas(canvas);
    const mouse = { x: -1000, y: -1000 };
    let frame = 0;

    const alpha = (x: number, y: number) => {
      const distance = Math.hypot(mouse.x - x, mouse.y - y);
      if (distance > PROXIMITY) return BASE_OPACITY;
      const opacity = Math.max(BASE_OPACITY, 1 - distance / PROXIMITY);
      return opacity + ((opacity - BASE_OPACITY) / (1 - BASE_OPACITY)) * 0.3;
    };

    const draw = () => {
      frame = 0;
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.lineWidth = 1;
      const columns = Math.ceil(size.width / SPACING);
      const rows = Math.ceil(size.height / SPACING);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.globalAlpha = BASE_OPACITY;
      ctx.beginPath();
      for (let c = 0; c < columns; c++) {
        const x = c * SPACING + SPACING / 2 + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size.height);
      }
      for (let r = 0; r < rows; r++) {
        const y = r * SPACING + SPACING / 2 + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(size.width, y);
      }
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const x = c * SPACING + SPACING / 2;
          const y = r * SPACING + SPACING / 2;
          ctx.globalAlpha = Math.min(1, alpha(x, y));
          ctx.fillRect(x - 2, y - 0.25, 5, 1.5);
          ctx.fillRect(x - 0.25, y - 2, 1.5, 5);
        }
      }
      ctx.globalAlpha = 1;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      schedule();
    };
    const onResize = () => {
      size = fitCanvas(canvas);
      schedule();
    };

    draw();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={styles.gridBackground} aria-hidden="true" />;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789";

export function LetterGlitch({ colors }: { colors: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;
    const pick = <T,>(list: ArrayLike<T>) => list[Math.floor(Math.random() * list.length)];
    let size = fitCanvas(canvas);
    let columns = 0;
    let cells: { char: string; color: string }[] = [];
    let timer = 0;

    const reset = () => {
      size = fitCanvas(canvas);
      columns = Math.ceil(size.width / 10);
      const rows = Math.ceil(size.height / 20);
      cells = Array.from({ length: columns * rows }, () => ({ char: pick(GLYPHS), color: pick(colors) }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.font = "16px monospace";
      ctx.textBaseline = "top";
      cells.forEach((cell, index) => {
        ctx.fillStyle = cell.color;
        ctx.fillText(cell.char, (index % columns) * 10, Math.floor(index / columns) * 20);
      });
    };
    const tick = () => {
      for (let i = 0; i < Math.max(1, cells.length * 0.05); i++) {
        const cell = pick(cells);
        cell.char = pick(GLYPHS);
        cell.color = pick(colors);
      }
      draw();
    };
    const start = () => {
      reset();
      draw();
      if (!timer && !reducedMotion()) timer = window.setInterval(tick, 50);
    };
    const stop = () => {
      clearInterval(timer);
      timer = 0;
    };

    // Runs only while hovered: the page carries dozens of these overlays.
    host.addEventListener("pointerenter", start);
    host.addEventListener("pointerleave", stop);
    return () => {
      stop();
      host.removeEventListener("pointerenter", start);
      host.removeEventListener("pointerleave", stop);
    };
  }, [colors]);

  return <canvas ref={ref} className={styles.glitch} aria-hidden="true" />;
}

export function LedMatrix() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const CELL = 16;
    const STEP = 18;
    const color = () => (Math.random() < 0.4 ? GREEN : "rgba(255, 255, 255, 0.05)");
    let size = { width: 0, height: 0 };
    let cells: { x: number; y: number; color: string; next: number; wait: number }[] = [];
    let frame = 0;
    let visible = false;

    const build = () => {
      size = fitCanvas(canvas);
      cells = [];
      const now = performance.now();
      for (let y = 0; y < size.height; y += STEP) {
        for (let x = 0; x < size.width; x += STEP) {
          const wait = Math.random() * 4100;
          cells.push({ x, y, color: color(), wait, next: now + Math.random() * 5000 + wait });
        }
      }
    };
    const draw = (now: number) => {
      ctx.clearRect(0, 0, size.width, size.height);
      for (const cell of cells) {
        if (now > cell.next) {
          cell.next = now + cell.wait * 2;
          cell.color = color();
        }
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, CELL, CELL);
      }
      frame = visible ? requestAnimationFrame(draw) : 0;
    };

    build();
    draw(performance.now());
    const resize = new ResizeObserver(build);
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !reducedMotion();
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={styles.ledCanvas} aria-hidden="true" />;
}

function landDots(land: GeoPermissibleObjects) {
  const width = 720;
  const height = 360;
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const ctx = mask.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.beginPath();
  geoPath(geoEquirectangular().fitSize([width, height], { type: "Sphere" }), ctx)(land);
  ctx.fill();
  const pixels = ctx.getImageData(0, 0, width, height).data;
  const dots: [number, number][] = [];
  for (let lat = -88; lat <= 88; lat += 2.5) {
    const step = 2.5 / Math.max(0.3, Math.cos((lat * Math.PI) / 180));
    for (let lng = -180; lng < 180; lng += step) {
      const x = Math.floor(((lng + 180) / 360) * width);
      const y = Math.floor(((90 - lat) / 180) * height);
      if (pixels[(y * width + x) * 4 + 3] > 128) dots.push([lng, lat]);
    }
  }
  return dots;
}

export function Globe({ marker: markerAt }: { marker?: [number, number] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let cancelled = false;
    let frame = 0;
    let paused = false;
    let cleanup = () => {};

    import("world-atlas/land-110m.json").then(({ default: atlas }) => {
      if (cancelled) return;
      const topology = atlas as unknown as Topology;
      const land = feature(topology, topology.objects.land);
      const graticule = geoGraticule10();
      const dots = landDots(land);
      const { width } = fitCanvas(canvas);
      const projection = geoOrthographic()
        .scale(width / 2 - 1)
        .translate([width / 2, width / 2])
        .clipAngle(90);
      const path = geoPath(projection, ctx);
      let longitude = 15;
      let last = performance.now();

      const draw = (now: number) => {
        if (!paused) longitude += (now - last) * 0.006;
        last = now;
        projection.rotate([longitude, -42, 0]);
        ctx.clearRect(0, 0, width, width);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "rgba(82, 179, 131, 0.3)";
        ctx.beginPath();
        path(graticule);
        ctx.stroke();
        ctx.strokeStyle = "rgba(82, 179, 131, 0.6)";
        ctx.beginPath();
        path(land);
        ctx.stroke();
        ctx.fillStyle = "rgba(82, 179, 131, 0.5)";
        for (const dot of dots) {
          if (geoDistance(dot, [-longitude, 42]) > Math.PI / 2) continue;
          const point = projection(dot);
          if (point) ctx.fillRect(point[0], point[1], 0.8, 0.8);
        }
        ctx.beginPath();
        path({ type: "Sphere" });
        ctx.stroke();
        const marker = markerAt && projection(markerAt);
        const facing = markerAt && path({ type: "Point", coordinates: markerAt });
        if (marker && facing !== null) {
          ctx.fillStyle = GREEN;
          ctx.beginPath();
          ctx.arc(marker[0], marker[1], 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        if (!reducedMotion()) frame = requestAnimationFrame(draw);
      };
      const pause = () => (paused = true);
      const resume = () => (paused = false);
      canvas.addEventListener("pointerenter", pause);
      canvas.addEventListener("pointerleave", resume);
      cleanup = () => {
        canvas.removeEventListener("pointerenter", pause);
        canvas.removeEventListener("pointerleave", resume);
      };
      frame = requestAnimationFrame(draw);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [markerAt]);

  return <canvas ref={ref} className={styles.globeCanvas} aria-hidden="true" />;
}

const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}`;

export function ParticleShape() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    const size = () => [host.clientWidth, host.clientHeight] as const;
    const [width, height] = size();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;
    const isPhone = window.matchMedia("(max-width: 809.98px)").matches;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("rgb(6, 36, 21)") },
        color2: { value: new THREE.Color("rgb(5, 38, 22)") },
        noiseAmp: { value: 0.8 },
        noiseFreq: { value: 1.4 },
        particleSize: { value: isPhone ? 2 : 0.5 },
      },
      vertexShader: `
        uniform float time;
        uniform float noiseAmp;
        uniform float noiseFreq;
        uniform float particleSize;
        varying vec3 vPosition;
        ${NOISE_GLSL}
        void main() {
          vec3 pos = position;
          vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y * noiseFreq + time, pos.z * noiseFreq);
          float displacement = snoise(noisePos) * noiseAmp;
          pos += normal * displacement;
          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = particleSize + (displacement * 5.0);
        }`,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        void main() {
          float ll = length(gl_PointCoord.xy - vec2(0.5));
          if (ll > 0.5) discard;
          vec3 finalColor = mix(color1, color2, (vPosition.y + 1.5) / 3.0);
          gl_FragColor = vec4(finalColor, smoothstep(0.5, 0.1, ll) * 0.5);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const geometry = new THREE.IcosahedronGeometry(1.5, 24);
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;
    let visible = false;
    const started = performance.now();
    const draw = (now: number) => {
      const seconds = (now - started) / 1000;
      material.uniforms.time.value = seconds * 0.5;
      points.rotation.y = seconds * 0.1;
      renderer.render(scene, camera);
      frame = visible ? requestAnimationFrame(draw) : 0;
    };
    draw(started);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !reducedMotion();
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    observer.observe(host);
    const resize = new ResizeObserver(() => {
      const [w, h] = size();
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resize.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className={styles.particles} aria-hidden="true" />;
}

const TOKEN = /("[^"]*")|\b(import|from|export|default|function|const|return)\b|([{}()[\]<>/=])/g;

function CodeLine({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(TOKEN)) {
    parts.push(text.slice(cursor, match.index));
    const tone = match[1] ? styles.codeString : match[2] ? styles.codeKeyword : styles.codeBracket;
    parts.push(
      <span key={match.index} className={tone}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

export function CodeTyper({ code, label }: { code: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      observer.disconnect();
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const step = reducedMotion() ? code.length : 1;
    const timer = setInterval(() => {
      setCount((value) => {
        if (value >= code.length) clearInterval(timer);
        return Math.min(value + step, code.length);
      });
    }, 70);
    return () => clearInterval(timer);
  }, [started, code]);

  useEffect(() => {
    const host = ref.current;
    if (host) host.scrollTop = host.scrollHeight;
  }, [count]);

  const lines = code.slice(0, count).split("\n");
  return (
    <div ref={ref} className={styles.codeBody} aria-label={label}>
      {lines.map((line, index) => (
        <div key={index} className={styles.codeRow}>
          <span className={styles.codeNumber}>{index + 1}</span>
          <code className={styles.codeText}>
            <CodeLine text={line} />
            {index === lines.length - 1 && <span className={styles.codeCursor}>▌</span>}
          </code>
        </div>
      ))}
    </div>
  );
}

export function RollingNumber({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setActive(true);
      observer.disconnect();
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {[...value].map((char, index) => (
        <span key={index} className={styles.rollCell} aria-hidden="true">
          <span
            className={active ? `${styles.rollChar} ${styles.rollActive}` : styles.rollChar}
            style={{ transitionDelay: `${index * 60}ms` }}
          >
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}
