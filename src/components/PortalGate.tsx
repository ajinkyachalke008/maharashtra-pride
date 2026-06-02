import { useEffect, useRef, useState } from "react";
import curtainLeft from "@/assets/curtain-left.png";
import curtainRight from "@/assets/curtain-right.png";
import { useIsMobile } from "@/hooks/use-mobile";

const GATE_BG = "/frames/ezgif-frame-001.jpg";
const WORLD_BG = "/frames/ezgif-frame-150.jpg";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));

export default function PortalGate() {
  const isMobile = useIsMobile();
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

  // Mobile tuning: shorter scroll runway, gentler scale, no mouse parallax
  const SCROLL_VH = isMobile ? 280 : 480;
  const PORTAL_MAX = isMobile ? 4 : 7.5;
  const WORLD_MAX = isMobile ? 1.08 : 1.18;
  const CURTAIN_SCALE_MAX = isMobile ? 1.15 : 1.3;
  const MAG = isMobile
    ? { world: 0, portal: 0, curtain: 0 }
    : { world: 6, portal: 7, curtain: 14 };

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
      progressRef.current = clamp(-rect.top / total, 0, 1);
    };
    const onMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    onScroll();

    let raf = 0;
    const tick = () => {
      if (!isMobile) {
        mouse.current.rx = lerp(mouse.current.rx, mouse.current.tx, 0.07);
        mouse.current.ry = lerp(mouse.current.ry, mouse.current.ty, 0.07);
      }
      const { rx, ry } = mouse.current;
      const p = progressRef.current;
      const eased = easeInOut(p);

      const worldScale = lerp(1, WORLD_MAX, p);
      if (worldRef.current) {
        worldRef.current.style.transform = `scale(${worldScale}) translate3d(${rx * MAG.world}px, ${ry * MAG.world}px, 0)`;
      }

      const portalScale = lerp(1, PORTAL_MAX, eased);
      const portalOpacity = clamp(1 - (p - 0.65) / 0.2, 0, 1);
      if (portalRef.current) {
        portalRef.current.style.transform = `scale(${portalScale}) translate3d(${rx * MAG.portal}px, ${ry * MAG.portal}px, 0)`;
        portalRef.current.style.opacity = String(portalOpacity);
      }

      const totalShift = 62 + (150 - 62) * eased;
      const curtainScale = lerp(1, CURTAIN_SCALE_MAX, eased);
      const lx = opened ? `-${totalShift}%` : "0%";
      const rxs = opened ? `${totalShift}%` : "0%";
      if (leftRef.current) {
        leftRef.current.style.transform = `translateX(calc(${lx} + ${rx * MAG.curtain}px)) translateY(${ry * MAG.curtain * 0.3}px) scale(${curtainScale}) translateZ(0)`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translateX(calc(${rxs} + ${rx * MAG.curtain}px)) translateY(${ry * MAG.curtain * 0.3}px) scale(${curtainScale}) translateZ(0)`;
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
  }, [opened, isMobile, PORTAL_MAX, WORLD_MAX, CURTAIN_SCALE_MAX, MAG.world, MAG.portal, MAG.curtain]);

  const curtainTransition = allowTransition
    ? `transform ${isMobile ? 1.6 : 2}s cubic-bezier(0.7, 0, 0.2, 1)`
    : "none";

  return (
    <section ref={sectionRef} style={{ height: `${SCROLL_VH}vh`, position: "relative", background: "#0a0608" }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* World — Mumbai HQ */}
        <div
          ref={worldRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${worldBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />

        {/* Portal — ornate gate */}
        <div
          ref={portalRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${portalBg})`,
            backgroundSize: "contain",
            backgroundPosition: "center 60%",
            backgroundRepeat: "no-repeat",
            transformOrigin: "50% 55%",
            willChange: "transform, opacity",
          }}
        />

        {/* Curtains */}
        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 w-[55%]"
          style={{
            backgroundImage: `url(${curtainLeft})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#1a0808",
            transition: curtainTransition,
            willChange: "transform",
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
            transition: curtainTransition,
            willChange: "transform",
          }}
        />

        {/* Hero text */}
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
          <h1 className="font-devanagari text-4xl md:text-7xl font-bold gold-shimmer leading-tight" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>
            महाराष्ट्र पोलीस
          </h1>
          <p className="font-devanagari italic text-base md:text-xl text-white/85 mt-5 tracking-wider" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
            सद्रक्षणाय खलनिग्रहणाय
          </p>
          <div className="mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          <p className="font-display text-sm md:text-lg text-white/90 mt-6 tracking-[0.25em] uppercase" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
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
