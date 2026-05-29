import { motion } from "framer-motion";

type Field = { label: string; value: string };
type Scroll = {
  name: string;
  marathi: string;
  tag?: "CITY" | "RAILWAY";
  fields: Field[];
};

const SCROLLS: Scroll[] = [
  { name: "MUMBAI", marathi: "मुंबई शहर", tag: "CITY", fields: [
    { label: "Commissioner of Police", value: "Deven Bharti, IPS" },
    { label: "Total Population", value: "Approx. 13.6 Million" },
    { label: "Jurisdiction", value: "Mumbai City and Suburban Districts" },
    { label: "Total Police Stations", value: "94" },
  ]},
  { name: "PUNE", marathi: "पुणे शहर", tag: "CITY", fields: [
    { label: "Commissioner of Police", value: "Amitesh Kumar, IPS" },
    { label: "Total Population", value: "Approx. 4.5 Million" },
    { label: "Jurisdiction", value: "Pune City Commissionerate" },
    { label: "Total Police Stations", value: "52" },
  ]},
  { name: "THANE", marathi: "ठाणे शहर", tag: "CITY", fields: [
    { label: "Commissioner of Police", value: "Vikram Patil, IPS" },
    { label: "Total Population", value: "Approx. 2.5 Million" },
    { label: "Jurisdiction", value: "Thane City Police Commissionerate" },
    { label: "Total Police Stations", value: "35" },
  ]},
  { name: "NAGPUR", marathi: "नागपूर शहर", tag: "CITY", fields: [
    { label: "Administrative Title", value: "Maharashtra State's Second Capital" },
    { label: "Commissioner of Police", value: "Suresh Sharma, IPS" },
    { label: "Total Population", value: "Approx. 2.4 Million" },
    { label: "Total Police Stations", value: "30" },
  ]},
  { name: "NASHIK", marathi: "नाशिक शहर", tag: "CITY", fields: [
    { label: "Description", value: "Wine Capital of India" },
    { label: "Population", value: "1.5M" },
    { label: "Notes", value: "Major wine-producing region and tourist destination" },
  ]},
  { name: "NAVI MUMBAI", marathi: "नवी मुंबई", tag: "CITY", fields: [
    { label: "Description", value: "Planned City" },
    { label: "Population", value: "1.1M" },
    { label: "Notes", value: "Part of Mumbai Metropolitan Region, satellite city" },
    { label: "Feature", value: "Harbour Zone" },
  ]},
  { name: "CHHATRAPATI SAMBHAJINAGAR", marathi: "छत्रपती संभाजीनगर", tag: "CITY", fields: [
    { label: "Description", value: "Marathwada HQ" },
    { label: "Population", value: "1.2M" },
    { label: "Notes", value: "Administrative headquarters of Marathwada region" },
  ]},
  { name: "SOLAPUR", marathi: "सोलापूर शहर", tag: "CITY", fields: [
    { label: "Description", value: "Textile City" },
    { label: "Location", value: "Southern Maharashtra" },
    { label: "Feature", value: "Gateway to South Maharashtra and industrial hub" },
  ]},
  { name: "AMRAVATI", marathi: "अमरावती शहर", tag: "CITY", fields: [
    { label: "Description", value: "Vidarbha Division — Melghat Region" },
    { label: "Population", value: "1.5M" },
    { label: "Notes", value: "Gateway to the Melghat tiger reserve" },
  ]},
  { name: "PIMPRI-CHINCHWAD", marathi: "पिंपरी चिंचवड", tag: "CITY", fields: [
    { label: "Description", value: "Industrial Capital · Pune Metro Region" },
    { label: "Population", value: "1.1M" },
    { label: "Notes", value: "Part of Pune Metropolitan Region" },
  ]},
  { name: "MIRA-BHAYANDER · VASAI-VIRAR", marathi: "मिरा-भायंदर, वसई-विरार", tag: "CITY", fields: [
    { label: "Description", value: "Fastest growing belt · Mumbai Metropolitan" },
    { label: "Population", value: "1.2M" },
    { label: "Notes", value: "HQ of Mira-Bhayander & Vasai-Virar" },
  ]},
  { name: "MUMBAI RAILWAY POLICE", marathi: "मुंबई रेल्वे पोलीस", tag: "RAILWAY", fields: [
    { label: "Description", value: "Largest railway network in Asia" },
    { label: "Daily Commuters", value: "7.5 Million" },
    { label: "Notes", value: "Ensures safety across Mumbai suburban rail network" },
  ]},
];

function Badge() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      <defs>
        <radialGradient id="badgeRed" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#9a2a1a" />
          <stop offset="100%" stopColor="#4a0e08" />
        </radialGradient>
        <linearGradient id="badgeGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7e08c" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#7a5e1f" />
        </linearGradient>
      </defs>
      {/* 8-point star */}
      <polygon
        points="40,2 48,28 74,20 56,40 74,60 48,52 40,78 32,52 6,60 24,40 6,20 32,28"
        fill="url(#badgeGold)"
        stroke="#5a4310"
        strokeWidth="1"
      />
      <circle cx="40" cy="40" r="20" fill="url(#badgeRed)" stroke="#c9a84c" strokeWidth="1.5" />
      <polygon
        points="40,28 43,37 52,37 45,43 48,52 40,46 32,52 35,43 28,37 37,37"
        fill="#f5e3a3"
      />
      <text x="40" y="60" textAnchor="middle" fontSize="4" fill="#f5e3a3" fontWeight="700" letterSpacing="0.5">
        महाराष्ट्र पोलीस
      </text>
    </svg>
  );
}

function Tassel({ side }: { side: "left" | "right" }) {
  return (
    <div className={`absolute top-10 ${side === "left" ? "-left-1" : "-right-1"} flex flex-col items-center pointer-events-none`}>
      {/* beads */}
      <div className="w-2 h-2 rounded-full bg-gradient-to-b from-[#f4d77a] to-[#8a6a1c]" />
      <div className="w-[3px] h-3 bg-[#b1844a]" />
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-[#f4d77a] to-[#8a6a1c]" />
      <div className="w-[3px] h-3 bg-[#b1844a]" />
      <div className="w-2 h-2 rounded-full bg-[#7a1a14]" />
      {/* tassel head */}
      <div className="w-4 h-3 rounded-t-full bg-gradient-to-b from-[#a82018] to-[#5a0e08] mt-0.5" />
      {/* strands */}
      <div className="flex gap-[1px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-[1.5px] bg-gradient-to-b from-[#c8261c] via-[#8a1610] to-[#3a0805]"
            style={{ height: `${28 + (i % 3) * 4}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const rot = { tl: "", tr: "scale-x-[-1]", bl: "scale-y-[-1]", br: "scale-[-1]" }[pos];
  const place = {
    tl: "top-1 left-1",
    tr: "top-1 right-1",
    bl: "bottom-1 left-1",
    br: "bottom-1 right-1",
  }[pos];
  return (
    <svg viewBox="0 0 60 60" className={`absolute ${place} ${rot} w-12 h-12 pointer-events-none opacity-60`}>
      <g fill="none" stroke="#a07c2a" strokeWidth="0.8">
        <path d="M4 4 L4 24 M4 4 L24 4" />
        <path d="M8 8 Q 18 6, 22 14 Q 14 18, 8 8 Z" fill="#c9a84c" opacity="0.35" />
        <circle cx="20" cy="20" r="1.4" fill="#a07c2a" />
        <path d="M14 28 Q 22 22, 30 28" />
        <path d="M28 14 Q 22 22, 28 30" />
      </g>
    </svg>
  );
}

function ScrollCard({ s, i }: { s: Scroll; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      className="relative group"
      style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
    >
      {/* Badge sitting above the scroll */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-16 h-16 z-20">
        <Badge />
      </div>

      {/* Top rod */}
      <div className="relative h-5 mx-[-12px] z-10">
        <div className="absolute inset-x-0 top-1 h-3 rounded-full bg-gradient-to-b from-[#f0d27a] via-[#c9a84c] to-[#7a5e1f] shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
        <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#f0d27a] to-[#7a5e1f] shadow-md" />
        <div className="absolute -right-2 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#f0d27a] to-[#7a5e1f] shadow-md" />
      </div>

      {/* Parchment body */}
      <div
        className="relative px-6 pt-10 pb-6 min-h-[420px] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
        style={{
          background:
            "radial-gradient(ellipse at top, #f7ecc8 0%, #ecd9a0 45%, #d9b96d 100%)",
          boxShadow:
            "inset 0 0 60px rgba(120,80,20,0.25), inset 0 0 12px rgba(80,50,10,0.35), 0 12px 28px rgba(0,0,0,0.55)",
        }}
      >
        {/* paper grain noise */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(120,80,20,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(120,80,20,0.3) 0%, transparent 45%)",
          }}
        />
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
        <Tassel side="left" /><Tassel side="right" />

        {s.tag && (
          <div className="relative z-10 flex justify-center mb-2">
            <span
              className={`text-[10px] tracking-[0.25em] font-bold px-3 py-0.5 rounded-sm border ${
                s.tag === "RAILWAY"
                  ? "bg-[#1d3a6b] text-[#e8d98a] border-[#c9a84c]"
                  : "bg-[#1a1a1a] text-[#e8c87a] border-[#7a5e1f]"
              }`}
            >
              {s.tag}
            </span>
          </div>
        )}

        <h3 className="relative z-10 text-center font-display text-2xl md:text-[26px] leading-tight text-[#1a1208] tracking-wide">
          {s.name}
        </h3>
        <div className="relative z-10 text-center font-devanagari text-base md:text-lg text-[#3a2812] mt-1">
          {s.marathi}
        </div>
        <div className="relative z-10 mx-auto my-3 flex items-center gap-2 justify-center text-[#7a5e1f]">
          <span className="h-px w-12 bg-[#7a5e1f]/60" />
          <span className="text-[10px]">◆</span>
          <span className="h-px w-12 bg-[#7a5e1f]/60" />
        </div>

        <dl className="relative z-10 space-y-2.5 text-[13px] text-[#231706] leading-snug">
          {s.fields.map((f) => (
            <div key={f.label}>
              <dt className="font-bold uppercase tracking-wider text-[11px] text-[#3a2208]">
                {f.label}:
              </dt>
              <dd className="text-[#231706]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Bottom rod */}
      <div className="relative h-5 mx-[-12px] -mt-1">
        <div className="absolute inset-x-0 top-1 h-3 rounded-full bg-gradient-to-b from-[#f0d27a] via-[#c9a84c] to-[#7a5e1f] shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
        <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#f0d27a] to-[#7a5e1f] shadow-md" />
        <div className="absolute -right-2 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#f0d27a] to-[#7a5e1f] shadow-md" />
      </div>

      {/* Red fringe */}
      <div className="flex justify-center gap-[2px] mt-0.5 px-4">
        {Array.from({ length: 36 }).map((_, k) => (
          <div
            key={k}
            className="w-[2px] bg-gradient-to-b from-[#a82018] via-[#7a1410] to-transparent"
            style={{ height: `${14 + (k % 4) * 3}px` }}
          />
        ))}
      </div>
    </motion.article>
  );
}

export default function CommissioneratesSection() {
  return (
    <section id="commissionerates" className="relative py-28 px-6" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="font-devanagari text-[var(--gold)] text-sm tracking-[0.4em] mb-3">
            ★ आयुक्तालय ★
          </div>
          <h2 className="font-display text-3xl md:text-5xl gold-shimmer tracking-wide">
            The Commissionerates
          </h2>
          <p className="mt-4 text-white/55 max-w-2xl mx-auto text-sm md:text-base">
            Twelve pillars of vigilance — each scroll a sworn charter of duty across
            Maharashtra's great cities and railway lines.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20 pt-8">
          {SCROLLS.map((s, i) => (
            <ScrollCard key={s.name} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
