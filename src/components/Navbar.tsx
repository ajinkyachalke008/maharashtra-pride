import { useEffect, useState } from "react";

const LINKS = [
  { label: "मुखपृष्ठ", en: "Home" },
  { label: "इतिहास", en: "History" },
  { label: "मूल्ये", en: "Values" },
  { label: "संपर्क", en: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#0d0d0d]/85 backdrop-blur-md border-b border-[var(--gold)]/15" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-display text-sm md:text-base tracking-[0.3em] text-[var(--gold)]">
          M • P
        </div>
        <ul className="flex items-center gap-6 md:gap-10">
          {LINKS.map((l) => (
            <li key={l.en} className="group cursor-pointer">
              <div className="font-devanagari text-sm text-white/80 group-hover:text-[var(--gold)] transition">{l.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
