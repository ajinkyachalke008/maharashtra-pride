import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-[2px] h-screen z-40 pointer-events-none">
      <div
        className="bg-gradient-to-b from-[var(--gold-bright)] to-[var(--gold)] w-full origin-top"
        style={{ height: `${p * 100}%`, boxShadow: "0 0 8px var(--gold-bright)" }}
      />
    </div>
  );
}
