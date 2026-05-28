import { useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Star, Heart } from "lucide-react";

const VALUES = [
  { icon: Shield, marathi: "कर्तव्य", english: "Duty", desc: "An unwavering commitment to the constitution and to every citizen of Maharashtra. Service before self, in every shift, every street, every call." },
  { icon: Star, marathi: "सन्मान", english: "Honor", desc: "Integrity that cannot be bought, courage that cannot be broken. The badge is worn with pride and the uniform with discipline." },
  { icon: Heart, marathi: "सेवा", english: "Service", desc: "From metropolitan beats to remote villages, 185,000 officers stand as the first response, the steady hand, and the listening ear." },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const handle = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };
  return (
    <div ref={ref} onMouseMove={handle} onMouseLeave={reset} className="tilt-card">
      {children}
    </div>
  );
}

export default function ValuesSection() {
  return (
    <section className="relative py-24 md:py-32 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.4em] text-[var(--gold)]/70 uppercase mb-3">Our Pillars</div>
          <h2 className="font-display text-3xl md:text-5xl text-white/90 tracking-wide">Three Words. One Oath.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.english}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard>
                <div
                  className="relative bg-[#161616] p-8 md:p-10 h-full"
                  style={{ borderTop: "3px solid var(--gold)" }}
                >
                  <v.icon className="w-10 h-10 text-[var(--gold)]" strokeWidth={1.4} />
                  <div className="font-devanagari text-[var(--gold)] mt-6 text-lg">{v.marathi}</div>
                  <h3 className="font-display text-3xl text-white mt-1 tracking-wider">{v.english}</h3>
                  <p className="text-sm text-white/55 mt-4 leading-relaxed">{v.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
