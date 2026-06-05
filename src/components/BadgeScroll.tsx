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
      scrub: 1.2,
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
    <section ref={containerRef} className="relative" style={{ height: "3000px" }}>
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


        </div>
      </div>
    </section>
  );
}
