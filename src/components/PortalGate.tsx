import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import curtainLeft from "@/assets/curtain-left.png";
import curtainRight from "@/assets/curtain-right.png";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroSection from "@/components/HeroSection";
import { ShaderAnimation } from "@/components/ui/shader-animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 300;
const FRAME_URLS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/portal-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));

// Cinematic easing — slow start at the gate, smooth approach,
// quick pass-through, gentle settle on the HQ reveal.
// Piecewise cubic-like curve over scroll progress [0,1] -> frame progress [0,1].
void clamp;

// Cleaner mapping: directly compute target frame index from scroll progress.
function progressToFrameIndex(p: number): number {
  // Anchor points: (scrollProgress, frameIndex)
  // Shifted to allow a massive scroll holding zone at the end (0.60 -> 1.00)
  const stops: Array<[number, number]> = [
    [0.00, 0],
    [0.12, 80],
    [0.25, 160],
    [0.37, 220],
    [0.50, 280],
    [0.60, FRAME_COUNT - 1],
    [1.00, FRAME_COUNT - 1],
  ];
  for (let i = 1; i < stops.length; i++) {
    const [p0, f0] = stops[i - 1];
    const [p1, f1] = stops[i];
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0);
      // smoothstep within segment
      const e = t * t * (3 - 2 * t);
      return Math.round(f0 + (f1 - f0) * e);
    }
  }
  return FRAME_COUNT - 1;
}

type Stage = {
  start: number; end: number; eyebrow: string; title: string; sub?: string; devanagari?: boolean;
};

const STAGES: Stage[] = [
  { start: 0.00, end: 0.12, eyebrow: "Stage I", title: "Gateway to Service" },
  { start: 0.14, end: 0.25, eyebrow: "Stage II", title: "Approaching the Threshold" },
  { start: 0.27, end: 0.37, eyebrow: "Stage III", title: "Crossing the Gate" },
  { start: 0.40, end: 0.50, eyebrow: "Stage IV", title: "The Headquarters" },
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
  if (opacity <= 0) return null;
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
  const [firstFrameDrawn, setFirstFrameDrawn] = useState(false);
  const firstFrameDrawnRef = useRef(false);

  // Higher concurrency for faster initial paint
  const { images, loaded } = useImagePreloader(FRAME_URLS, 48);

  // Curtain choreography - strictly wait for first frame to be drawn
  useEffect(() => {
    if (firstFrameDrawn) {
      const t1 = setTimeout(() => setOpened(true), 50); // Wait for paint
      const t2 = setTimeout(() => setUiIn(true), 500);
      const t3 = setTimeout(() => setAllowTransition(false), 2400);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [firstFrameDrawn]);

  // Canvas draw loop — runs immediately; picks nearest available frame
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      dirtyRef.current = true;
    };
    resize();
    window.addEventListener("resize", resize);

    const pickNearest = (target: number): HTMLImageElement | undefined => {
      const arr = images.current;
      if (arr[target]) return arr[target];
      // search outwards
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (arr[target - d]) return arr[target - d];
        if (arr[target + d]) return arr[target + d];
      }
      return undefined;
    };

    let rafId = 0;
    const draw = () => {
      if (dirtyRef.current) {
        const img = pickNearest(frameIndexRef.current);
        const rect = wrapper.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        if (img) {
          const iw = img.naturalWidth || 1920;
          const ih = img.naturalHeight || 1080;
          // cover fit, matches BadgeScroll cinematic feel
          const scale = Math.max(rect.width / iw, rect.height / ih) * 1.02;
          const w = iw * scale;
          const h = ih * scale;
          const x = (rect.width - w) / 2;
          const y = (rect.height - h) / 2;
          ctx.drawImage(img, x, y, w, h);
          
          if (!firstFrameDrawnRef.current) {
            firstFrameDrawnRef.current = true;
            setFirstFrameDrawn(true);
          }
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
  }, [images]);

  // Mark dirty as new frames stream in so the current view upgrades
  useEffect(() => {
    dirtyRef.current = true;
  }, [loaded]);

  // ScrollTrigger driving cinematic frame mapping + hero fade
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      snap: {
        snapTo: (value) => (value > 0.96 ? 1 : value < 0.02 ? 0 : value),
        duration: { min: 0.1, max: 0.35 },
        delay: 0,
        ease: "power2.out",
      },
      onUpdate: (self) => {
        const p = self.progress;
        const idx = progressToFrameIndex(p);
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
  }, []);

  // HeroSection opacity calculation with a clean fade-out at the end of the PortalGate scroll
  // so it does not overlap with the BadgeScroll marquee.
  let heroOpacity = 0;
  if (progress >= 0.50 && progress <= 0.60) {
    heroOpacity = (progress - 0.50) / 0.10;
  } else if (progress > 0.60 && progress < 0.90) {
    heroOpacity = 1; // 30% of 800vh = 240vh hold (more than 2 full scrolls)
  } else if (progress >= 0.90 && progress <= 0.95) {
    heroOpacity = 1 - (progress - 0.90) / 0.05;
  } else {
    heroOpacity = 0;
  }
  heroOpacity = Math.max(0, Math.min(1, heroOpacity));

  const curtainTransition = allowTransition
    ? `transform ${isMobile ? 1.6 : 2}s cubic-bezier(0.7, 0, 0.2, 1)`
    : "none";

  // Extended to 800vh on desktop to give the user a massive 2.5x scroll holding zone on the Hero text
  const SCROLL_VH = isMobile ? 500 : 800;

  return (
    <section ref={sectionRef} style={{ height: `${SCROLL_VH}vh`, position: "relative", background: "#0f0f0f" }}>
      <div ref={wrapperRef} className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Shader Animation Background — directly behind the canvas */}
        <div className="absolute inset-0 z-0">
          <ShaderAnimation />
        </div>

        {/* Canvas with fading opacity near the end of scroll */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 block w-full h-full z-10" 
          style={{
            opacity: clamp(1 - (progress - 0.50) / 0.10, 0, 1),
          }}
        />

        {/* Seamless inline transition to HeroSection overlay */}
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            opacity: heroOpacity,
          }}
        >
          {heroOpacity > 0 && (
            <HeroSection isActive={progress >= 0.55} hideBackground={true} />
          )}
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[12]"
          style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)" }}
        />

        {/* Curtains — Original styling */}
        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 w-[55%]"
          style={{
            backgroundImage: `url(${curtainLeft})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            transform: opened ? "translateX(-100%)" : "translateX(0)",
            transition: curtainTransition,
            willChange: "transform",
            zIndex: 15,
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
            transform: opened ? "translateX(100%)" : "translateX(0)",
            transition: curtainTransition,
            willChange: "transform",
            zIndex: 15,
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
            zIndex: 20,
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
