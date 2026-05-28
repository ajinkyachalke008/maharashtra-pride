import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useImagePreloader } from "@/hooks/useImagePreloader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 270;
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
  const { images, loaded, total, progress: loadProgress, done } = useImagePreloader(FRAME_URLS);

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
      {/* Loader */}
      {!done && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d]">
          <div className="absolute top-0 left-0 h-[2px] bg-[var(--gold)]" style={{ width: `${loadProgress * 100}%`, boxShadow: "0 0 10px var(--gold-bright)" }} />
          <div className="star-spinner" />
          <div className="mt-8 font-display text-[var(--gold)] text-lg tracking-[0.3em]">
            LOADING... {Math.round(loadProgress * 100)}%
          </div>
          <div className="mt-2 text-xs text-white/40">{loaded} / {total} frames</div>
        </div>
      )}

      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: "#1e1e1e" }}>
        <div ref={wrapperRef} className="relative mx-auto h-full" style={{ maxWidth: "min(886px, 100vw)", aspectRatio: "886 / 624" }}>
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* Overlays */}
          <Overlay progress={progress} start={0.00} end={0.15} className="top-[8%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <h2 className="font-display text-2xl md:text-5xl text-white/85 tracking-wide">Witness the Birth of an Icon</h2>
          </Overlay>

          <Overlay progress={progress} start={0.18} end={0.33} className="top-1/2 -translate-y-1/2 left-4 md:left-8 max-w-[45%]"
          >
            <div className="font-devanagari text-3xl md:text-5xl text-[var(--gold)] font-bold" style={{ textShadow: "0 0 30px rgba(201,168,76,0.4)" }}>महाराष्ट्र</div>
            <div className="mt-3 text-xs md:text-sm text-white/55 tracking-widest uppercase">Founded 1843 · Maharashtra State</div>
          </Overlay>

          <Overlay progress={progress} start={0.36} end={0.52} className="top-1/2 -translate-y-1/2 right-4 md:right-8 max-w-[45%] text-right">
            <div className="font-devanagari text-3xl md:text-5xl text-[var(--gold)] font-bold" style={{ textShadow: "0 0 30px rgba(201,168,76,0.4)" }}>पोलीस</div>
            <div className="mt-3 text-xs md:text-sm text-white/55 tracking-widest uppercase">185,000+ Officers · 130M Citizens</div>
          </Overlay>

          <Overlay progress={progress} start={0.55} end={0.70} className="bottom-[12%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="font-devanagari text-2xl md:text-4xl text-[var(--gold)]" style={{ letterSpacing: "0.3em" }}>सद्रक्षणाय</div>
            <div className="mt-2 text-xs md:text-base text-white/60 italic">To Protect the Good</div>
          </Overlay>

          <Overlay progress={progress} start={0.72} end={0.87} className="bottom-[12%] left-1/2 -translate-x-1/2 w-full text-center px-6">
            <div className="font-devanagari text-2xl md:text-4xl text-[var(--gold)]" style={{ letterSpacing: "0.3em" }}>खलनिग्रहणाय</div>
            <div className="mt-2 text-xs md:text-base text-white/60 italic">To Punish the Wicked</div>
          </Overlay>
        </div>

        {/* Final reveal */}
        {progress >= 0.9 && (
          <div className="absolute bottom-[6%] left-0 right-0 text-center">
            <h3 className="font-display text-2xl md:text-4xl gold-shimmer tracking-[0.2em]">THE BADGE. THE PROMISE.</h3>
            <div className="relative h-0 w-0 mx-auto">
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i / 10) * Math.PI * 2;
                return (
                  <span
                    key={i}
                    className="burst-p"
                    style={{
                      ["--bx" as any]: `${Math.cos(angle) * 80}px`,
                      ["--by" as any]: `${Math.sin(angle) * 80}px`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
