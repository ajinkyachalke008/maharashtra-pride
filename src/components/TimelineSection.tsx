import { motion } from "framer-motion";

const EVENTS = [
  { year: "1843", title: "The Force is Born", desc: "Maharashtra Police established under British administration, laying foundations of disciplined civic policing." },
  { year: "1947", title: "An Independent Nation", desc: "Integration into the police service of free India. A new oath, a new constitution, an unchanged purpose." },
  { year: "1960", title: "State Reorganized", desc: "Maharashtra state is formed. The force is reorganized to serve a vast and diverse new geography." },
  { year: "2001", title: "Modernization Drive", desc: "Technology, training, and forensic capability are scaled. The force enters the digital era." },
  { year: "2008", title: "26/11: Bravery & Sacrifice", desc: "Officers gave their lives defending Mumbai. Their courage became the conscience of a nation." },
  { year: "2024", title: "India's Largest Force", desc: "185,000 strong. The largest state police force in India, serving 130 million citizens across 36 districts." },
];

export default function TimelineSection() {
  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="text-xs tracking-[0.4em] text-[var(--gold)]/70 uppercase mb-3">A Legacy</div>
          <h2 className="font-display text-3xl md:text-5xl text-white/90 tracking-wide">181 Years of Service</h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/40 to-transparent" />

          <div className="space-y-16 md:space-y-24">
            {EVENTS.map((e, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={e.year}
                  initial={{ opacity: 0, x: left ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative grid md:grid-cols-2 gap-6 items-center ${left ? "" : "md:[direction:rtl]"}`}
                >
                  <div className={`md:[direction:ltr] ${left ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                    <div className="font-display text-4xl md:text-5xl text-[var(--gold)] tracking-wider">{e.year}</div>
                    <h3 className="text-lg md:text-xl text-white mt-2 font-semibold">{e.title}</h3>
                    <p className="text-sm text-white/55 mt-2 leading-relaxed">{e.desc}</p>
                  </div>
                  <div className="hidden md:block" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-2 w-3 h-3 rounded-full bg-[var(--gold)]" style={{ boxShadow: "0 0 0 4px rgba(201,168,76,0.15), 0 0 16px var(--gold-bright)" }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
