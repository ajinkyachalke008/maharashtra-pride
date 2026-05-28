import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 185000, suffix: "+", label: "Officers", marathi: "अधिकारी" },
  { value: 36, suffix: "", label: "Districts", marathi: "जिल्हे" },
  { value: 1843, suffix: "", label: "Established", marathi: "स्थापना" },
  { value: 130, suffix: "M+", label: "Citizens Protected", marathi: "नागरिक" },
];

function Counter({ to, suffix, active }: { to: number; suffix: string; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active]);
  return <span>{n.toLocaleString("en-IN")}{suffix}</span>;
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-[#111008] overflow-hidden">
      <div className="scan-line" />
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-12">
        {STATS.map((s, i) => (
          <div key={s.label} className={`relative text-center ${i > 0 ? "md:border-l md:border-[var(--gold)]/20" : ""}`}>
            <div className="font-display text-4xl md:text-6xl text-[var(--gold)] font-bold tracking-wider">
              <Counter to={s.value} suffix={s.suffix} active={active} />
            </div>
            <div className="font-devanagari text-xs md:text-sm text-[var(--gold)]/60 mt-3">{s.marathi}</div>
            <div className="text-[10px] md:text-xs text-white/45 mt-1 tracking-[0.3em] uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
