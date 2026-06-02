import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import curtainLeft from "@/assets/curtain-left.png";
import curtainRight from "@/assets/curtain-right.png";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useIsMobile } from "@/hooks/use-mobile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 300;
const FRAME_URLS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/portal-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));

type Stage = {
  start: number; end: number; eyebrow: string; title: string; sub?: string; devanagari?: boolean;
};

const STAGES: Stage[] = [
  { start: 0.00, end: 0.24, eyebrow: "Stage I", title: "Gateway to Service" },
  { start: 0.28, end: 0.50, eyebrow: "Stage II", title: "Approaching the Threshold" },
  { start: 0.55, end: 0.70, eyebrow: "Stage III", title: "Crossing the Gate" },
  { start: 0.74, end: 0.90, eyebrow: "Stage IV", title: "The Headquarters" },
  { start: 0.93, end: 1.00, eyebrow: "Est. 1843", title: "महाराष्ट्र पोलीस", sub: "Serving with Honor", devanagari: true },
];

function Overlay({ progress, stage }: { progress: number; stage: Stage }) {
  const fadeIn = 0.04;
  let opacity = 0;
  if (progress >= stage.start && progress <= stage.end) {
    if (progress < stage.start + fadeIn) opacity = (progress - stage.start) / fadeIn;
    else if (progress > stage.end - fadeIn) opacity = (stage.end - progress) / fadeIn;
    else opacity = 1;
  }
  opacity = clamp(opacity, 0, 1);
  return (
    <div
      className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-full text-center px-6 pointer-events-none"
      style={{ opacity, transition: "opacity 0.1s linear" }}
    >
      <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/90 uppercase mb-3">{stage.eyebrow}</div>
      <h2
        className={`${stage.devanagari ? "font-devanagari gold-shimmer" : "font-display text-white"} text-3xl md:text-6xl tracking-wide`}
        style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}
      >
        {stage.title}
      </h2>
      {stage.sub && (
        <div className="mt-3 text-xs md:text-sm text-white/80 tracking-[0.35em] uppercase">{stage.sub}</div>
      )}
    </div>
  );
}

export default function PortalGate() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const frameIndexRef = useRef(0);
  const dirtyRef = useRef(true);
  const [progress, setProgress] = useState(0);
  const [opened, setOpened] = useState(false);
  const [uiIn, setUiIn] = useState(false);
  const [allowTransition, setAllowTransition] = useState(true);

  const { images, done } = useImagePreloader(FRAME_URLS);

  // Curtain choreography on mount
  useEffect(() => {
    const t1 = setTimeout(() => setOpened(true), 200);
    const t2 = setTimeout(() => setUiIn(true), 700);
    const t3 = setTimeout(() => setAllowTransition(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Canvas draw loop (cover-fit, fills the viewport)
  useEffect(() => {
    if (!done) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirtyRef.current = true;
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const draw = () => {
      if (dirtyRef.current) {
        const img = images.current[frameIndexRef.current];
        const rect = wrapper.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        if (img) {
          const iw = img.naturalWidth || 1920;
          const ih = img.naturalHeight || 1080;
          // cover fit
          const scale = Math.max(rect.width / iw, rect.height / ih);
          const w = iw * scale;
          const h = ih * scale;
          const x = (rect.width - w) / 2;
          const y = (rect.height - h) / 2;
          ctx.drawImage(img, x, y, w, h);
        }
        dirtyRef.current = false;
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [done, images]);

  // ScrollTrigger driving frame index + hero fade
  useEffect(() => {
    if (!done) return;
    const el = sectionRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(p * (FRAME_COUNT - 1))));
        if (idx !== frameIndexRef.current) {
          frameIndexRef.current = idx;
          dirtyRef.current = true;
        }
        setProgress(p);
        if (heroRef.current) {
          heroRef.current.style.opacity = String(clamp(1 - p / 0.12, 0, 1));
        }
      },
    });
    return () => { trigger.kill(); };
  }, [done]);

  const curtainTransition = allowTransition
    ? `transform ${isMobile ? 1.6 : 2}s cubic-bezier(0.7, 0, 0.2, 1)`
    : "none";

  // Mobile: shorter runway
  const SCROLL_VH = isMobile ? 360 : 520;

  return (
    <section ref={sectionRef} style={{ height: `${SCROLL_VH}vh`, position: "relative", background: "#0a0608" }}>
      <div ref={wrapperRef} className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)" }}
        />

        {/* Curtains — reveal on load only */}
        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 w-[55%]"
          style={{
            backgroundImage: `url(${curtainLeft})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#1a0808",
            transform: opened ? "translateX(-100%)" : "translateX(0)",
            transition: curtainTransition,
            willChange: "transform",
            zIndex: 5,
          }}
        />
        <div
          ref={rightRef}
          className="absolute inset-y-0 right-0 w-[55%]"
          style={{
            backgroundImage: `url(${curtainRight})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#1a0808",
            transform: opened ? "translateX(100%)" : "translateX(0)",
            transition: curtainTransition,
            willChange: "transform",
            zIndex: 5,
          }}
        />

        {/* Stage overlays driven by scroll */}
        {STAGES.map((s, i) => (
          <Overlay key={i} progress={progress} stage={s} />
        ))}

        {/* Hero intro text — fades on scroll */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{
            opacity: uiIn ? 1 : 0,
            transform: uiIn ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease 300ms, transform 0.9s ease 300ms",
            zIndex: 10,
          }}
        >
          <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/90 uppercase mb-5">Est. 1843</div>
          <h1
            className="font-devanagari text-4xl md:text-7xl font-bold gold-shimmer leading-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}
          >
            महाराष्ट्र पोलीस
          </h1>
          <p
            className="font-devanagari italic text-base md:text-xl text-white/85 mt-5 tracking-wider"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
          >
            सद्रक्षणाय खलनिग्रहणाय
          </p>
          <div className="mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          <p
            className="font-display text-sm md:text-lg text-white/90 mt-6 tracking-[0.25em] uppercase"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
          >
            Enter the Gate
          </p>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.4em] text-[var(--gold)]/80 uppercase">Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
