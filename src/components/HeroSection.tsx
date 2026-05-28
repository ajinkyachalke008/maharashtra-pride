import { useMemo } from "react";

export default function HeroSection() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 12,
      dur: 14 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
      size: 2 + Math.random() * 3,
    })), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0f]">
      <div className="absolute inset-0 gold-radial pointer-events-none" />

      {/* particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              ["--drift" as any]: `${p.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 page-fade">
        <div className="text-xs md:text-sm tracking-[0.5em] text-[var(--gold)]/80 uppercase mb-6">Est. 1843</div>
        <h1 className="font-devanagari text-5xl md:text-8xl font-bold gold-shimmer leading-tight">
          महाराष्ट्र पोलीस
        </h1>
        <p className="font-devanagari italic text-lg md:text-2xl text-white/60 mt-6 tracking-wider">
          सद्रक्षणाय खलनिग्रहणाय
        </p>
        <div className="mt-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
        <p className="font-display text-base md:text-xl text-white/75 mt-8 tracking-[0.25em] uppercase">
          Maharashtra Police
        </p>
        <p className="text-sm md:text-base text-white/45 mt-3 tracking-wider">
          Guardians of the State
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] tracking-[0.4em] text-[var(--gold)]/70 uppercase">Scroll to Reveal</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
