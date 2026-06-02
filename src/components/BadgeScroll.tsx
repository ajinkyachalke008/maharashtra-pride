import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useImagePreloader } from "@/hooks/useImagePreloader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 300;
const FRAME_URLS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

function Overlay({ progress, start, end, children, className = "" }: {
  progress: number; start: number; end: number; children: React.ReactNode; className?: string;
}) {
  const fadeIn = 0.04;
  let opacity = 0;
  if (progress >= start && progress <= end) {
    if (progress < start + fadeIn) opacity = (progress - start) / fadeIn;
    else if (progress > end - fadeIn) opacity = (end - progress) / fadeIn;
    else opacity = 1;
  }
  opacity = Math.max(0, Math.min(1, opacity));
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{ opacity, transition: "opacity 0.1s linear" }}
    >
      {children}
    </div>
  );
}

export default function BadgeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameIndexRef = useRef(0);
  const dirtyRef = useRef(true);
  const [progress, setProgress] = useState(0);
  const { images, done } = useImagePreloader(FRAME_URLS);

  // Draw loop
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
          const iw = img.naturalWidth || 886;
          const ih = img.naturalHeight || 624;
          const scale = Math.min(rect.width / iw, rect.height / ih);
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

  // ScrollTrigger
  useEffect(() => {
    if (!done) return;
    const el = containerRef.current;
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
      },
    });
    return () => { trigger.kill(); };
  }, [done]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "2700px" }}>
      {/* Loader removed */}

      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "#1e1e1e" }}>
        <div
          ref={wrapperRef}
          className="relative"
          style={{
            width: "min(886px, 100vw)",
            aspectRatio: "886 / 624",
            maxHeight: "calc(100vh - 2 * clamp(28px, 4.5vw, 56px))",
          }}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* Top white marquee — flush with canvas top edge, spans full viewport width */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-full w-screen bg-white overflow-hidden border-y border-black/10 flex items-center"
            style={{ height: "clamp(28px, 4.5vw, 56px)" }}
          >
            <div className="marquee-track font-devanagari text-black font-bold whitespace-nowrap" style={{ fontSize: "clamp(13px, 1.8vw, 22px)" }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="inline-flex items-center mx-4">
                  <span className="text-[var(--gold)] mr-3">★</span>
                  महाराष्ट्र पोलीस
                </span>
              ))}
            </div>
          </div>

          {/* Bottom white marquee — flush with canvas bottom edge, spans full viewport width */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-screen bg-white overflow-hidden border-y border-black/10 flex items-center"
            style={{ height: "clamp(28px, 4.5vw, 56px)" }}
          >
            <div className="marquee-track marquee-reverse font-devanagari text-black font-bold whitespace-nowrap" style={{ fontSize: "clamp(13px, 1.8vw, 22px)" }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="inline-flex items-center mx-4">
                  <span className="text-[var(--gold)] mr-3">★</span>
                  महाराष्ट्र पोलीस
                </span>
              ))}
            </div>
          </div>

          {/* Cinematic institutional overlays */}
          <Overlay progress={progress} start={0.00} end={0.18} className="bottom-[14%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/90 uppercase mb-3">Stage I</div>
            <h2 className="font-display text-3xl md:text-6xl text-white tracking-wide" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>Gateway to Service</h2>
          </Overlay>

          <Overlay progress={progress} start={0.22} end={0.38} className="bottom-[14%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/90 uppercase mb-3">Stage II</div>
            <h2 className="font-display text-3xl md:text-6xl text-white tracking-wide" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>Protecting Citizens</h2>
          </Overlay>

          <Overlay progress={progress} start={0.42} end={0.58} className="bottom-[14%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/90 uppercase mb-3">Stage III</div>
            <h2 className="font-display text-3xl md:text-6xl text-white tracking-wide" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>Preserving Heritage</h2>
          </Overlay>

          <Overlay progress={progress} start={0.62} end={0.78} className="bottom-[14%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/90 uppercase mb-3">Stage IV</div>
            <h2 className="font-display text-3xl md:text-6xl text-white tracking-wide" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>Serving Maharashtra</h2>
          </Overlay>

          <Overlay progress={progress} start={0.82} end={1.0} className="bottom-[12%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="font-devanagari text-4xl md:text-6xl gold-shimmer font-bold tracking-wide" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>महाराष्ट्र पोलीस</div>
            <div className="mt-3 text-xs md:text-sm text-white/80 tracking-[0.35em] uppercase">Serving with Honor Since 1843</div>
          </Overlay>

        </div>
      </div>
    </section>
  );
}
