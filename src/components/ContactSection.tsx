import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

export default function ContactSection() {
  return (
    <footer className="relative bg-[#0a0a0a] border-t border-[var(--gold)]/15 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="flex items-center gap-4">
            <img src="/frames/ezgif-frame-270.jpg" alt="Maharashtra Police badge" className="w-16 h-16 object-cover rounded" />
            <div>
              <div className="font-display text-white text-lg tracking-wider">Maharashtra Police</div>
              <div className="font-devanagari text-xs text-[var(--gold)] mt-1">महाराष्ट्र पोलीस</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs tracking-[0.4em] text-white/40 uppercase mb-2">Emergency</div>
            <div className="font-display text-5xl md:text-6xl text-[var(--gold)] tracking-wider" style={{ textShadow: "0 0 30px rgba(201,168,76,0.4)" }}>100</div>
          </div>

          <div className="md:text-right">
            <ul className="font-devanagari text-sm text-white/70 space-y-2">
              <li><a href="#" className="hover:text-[var(--gold)] transition">महाराष्ट्र शासन</a></li>
              <li><a href="#" className="hover:text-[var(--gold)] transition">RTI</a></li>
              <li><a href="#" className="hover:text-[var(--gold)] transition">Careers</a></li>
              <li><a href="#" className="hover:text-[var(--gold)] transition">Media</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} Maharashtra Police. <span className="font-devanagari text-[var(--gold)]/70">सद्रक्षणाय खलनिग्रहणाय</span>
          </div>
          <div className="flex items-center gap-5 text-white/40">
            <a href="#" className="hover:text-[var(--gold)] transition"><Facebook size={16} /></a>
            <a href="#" className="hover:text-[var(--gold)] transition"><Twitter size={16} /></a>
            <a href="#" className="hover:text-[var(--gold)] transition"><Youtube size={16} /></a>
            <a href="#" className="hover:text-[var(--gold)] transition"><Instagram size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
