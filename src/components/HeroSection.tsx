import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";

interface HeroSectionProps {
  isActive?: boolean;
  hideBackground?: boolean;
}

export default function HeroSection({ isActive, hideBackground = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInViewLocal = useInView(sectionRef, { once: true, margin: "-100px" });
  const isInView = isActive !== undefined ? isActive : isInViewLocal;

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${hideBackground ? "bg-transparent" : "bg-[#0f0f0f]"}`}
      style={{ marginTop: "-1px" }}
    >
      {/* Shader animation background — fades in smoothly */}
      {!hideBackground && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <ShaderAnimation />
        </motion.div>
      )}

      {/* Top gradient blend — seamless transition from PortalGate */}
      {!hideBackground && (
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-[2]"
          style={{
            background: "linear-gradient(to bottom, #0f0f0f 0%, transparent 100%)",
          }}
        />
      )}

      {/* Dark vignette overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Bottom gradient blend — seamless transition to next section */}
      {!hideBackground && (
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[2]"
          style={{
            background: "linear-gradient(to top, #0f0f0f 0%, transparent 100%)",
          }}
        />
      )}

      {/* Staggered text animations */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          className="text-xs md:text-sm tracking-[0.5em] text-[var(--gold)]/80 uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          Est. 1843
        </motion.div>

        <motion.h1
          className="font-devanagari text-5xl md:text-8xl font-bold gold-shimmer leading-tight"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          महाराष्ट्र पोलीस
        </motion.h1>

        <motion.p
          className="font-devanagari italic text-lg md:text-2xl text-white/60 mt-6 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
        >
          सद्रक्षणाय खलनिग्रहणाय
        </motion.p>

        <motion.div
          className="mt-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
        />

        <motion.p
          className="font-display text-base md:text-xl text-white/75 mt-8 tracking-[0.25em] uppercase"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
        >
          Maharashtra Police
        </motion.p>

        <motion.p
          className="text-sm md:text-base text-white/45 mt-3 tracking-wider"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, delay: 2.0, ease: "easeOut" }}
        >
          Guardians of the State
        </motion.p>
      </div>

      {/* Scroll indicator — fades in last */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
      >
        <span className="text-[10px] tracking-[0.4em] text-[var(--gold)]/70 uppercase">Scroll to Reveal</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
}
