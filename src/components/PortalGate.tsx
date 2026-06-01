import { useEffect, useRef, useState } from "react";

const PORTAL_BG = "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779974947/portal_bg_mu60k9.png";
const CURTAIN_LEFT = "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/curtain_left_cdht6q.png";
const CURTAIN_RIGHT = "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975071/curtain_right_a9bn3i.png";
const WORLD_BG = "https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975077/world_bg_jzzcn1.jpg";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));

export default function PortalGate() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ tx: 0, ty: 0, rx: 0, ry: 0 });
  const progressRef = useRef(0);
  const [opened, setOpened] = useState(false);
  const [uiIn, setUiIn] = useState(false);
  const [allowTransition, setAllowTransition] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setOpened(true), 100);
    const t2 = setTimeout(() => setUiIn(true), 600);
    const t3 = setTimeout(() => setAllowTransition(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / total, 0, 1);
      progressRef.current = p;
    };
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    onScroll();

    let raf = 0;
    const tick = () => {
      mouse.current.rx = lerp(mouse.current.rx, mouse.current.tx, 0.07);
      mouse.current.ry = lerp(mouse.current.ry, mouse.current.ty, 0.07);
      const { rx, ry } = mouse.current;
      const p = progressRef.current;
      const eased = easeInOut(p);

      const worldScale = lerp(1, 1.18, p);
      if (worldRef.current) {
        worldRef.current.style.transform = `scale(${worldScale}) translate3d(${rx * 6}px, ${ry * 6}px, 0)`;
      }

      const portalScale = lerp(1, 7.5, eased);
      const portalOpacity = clamp(1 - (p - 0.65) / 0.2, 0, 1);
      if (portalRef.current) {
        portalRef.current.style.transform = `scale(${portalScale}) translate3d(${rx * 7}px, ${ry * 7}px, 0)`;
        portalRef.current.style.opacity = String(portalOpacity);
      }

      const totalShift = 62 + (150 - 62) * eased;
      const curtainScale = lerp(1, 1.3, eased);
      if (leftRef.current) {
        leftRef.current.style.transform = `translateX(calc(${opened ? `-${totalShift}%` : "0%"} + ${rx * 14}px)) translateY(${ry * 14 * 0.3}px) scale(${curtainScale}) translateZ(0)`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translateX(calc(${opened ? `${totalShift}%` : "0%"} + ${rx * 14}px)) translateY(${ry * 14 * 0.3}px) scale(${curtainScale}) translateZ(0)`;
      }

      if (heroRef.current) {
        heroRef.current.style.opacity = String(clamp(1 - p / 0.22, 0, 1));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [opened]);

  const curtainTransition = allowTransition ? "transform 2s cubic-bezier(0.7, 0, 0.2, 1)" : "none";

  return (
    <section ref={sectionRef} style={{ height: "480vh", position: "relative", background: "#0a0608" }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* World background */}
        <div
          ref={worldRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${WORLD_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />
        {/* Portal frame */}
        <div
          ref={portalRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${PORTAL_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transformOrigin: "52% 38%",
            willChange: "transform, opacity",
          }}
        />
        {/* Curtains */}
        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            backgroundImage: `url(${CURTAIN_LEFT})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
            transition: curtainTransition,
            willChange: "transform",
          }}
        />
        <div
          ref={rightRef}
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            backgroundImage: `url(${CURTAIN_RIGHT})`,
            backgroundSize: "cover",
            backgroundPosition: "left center",
            transition: curtainTransition,
            willChange: "transform",
          }}
        />

        {/* Hero text overlay */}
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
          <div className="text-[10px] md:text-xs tracking-[0.5em] text-[var(--gold)]/80 uppercase mb-5">Est. 1843</div>
          <h1 className="font-devanagari text-4xl md:text-7xl font-bold gold-shimmer leading-tight">
            महाराष्ट्र पोलीस
          </h1>
          <p className="font-devanagari italic text-base md:text-xl text-white/70 mt-5 tracking-wider">
            सद्रक्षणाय खलनिग्रहणाय
          </p>
          <div className="mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          <p className="font-display text-sm md:text-lg text-white/80 mt-6 tracking-[0.25em] uppercase">
            Enter the Gate
          </p>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.4em] text-[var(--gold)]/70 uppercase">Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
