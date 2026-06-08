import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import BadgeScroll from "@/components/BadgeScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import FullscreenToggle from "@/components/FullscreenToggle";
import PortalGate from "@/components/PortalGate";

const FraudLensSection = lazy(() => import("@/components/FraudLensSection"));
const CommissioneratesSection = lazy(() => import("@/components/CommissioneratesCloth"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maharashtra Police — Guardians of the State" },
      { name: "description", content: "A cinematic scrollytelling tribute to Maharashtra Police: 185,000+ officers, 36 districts, 181 years of service. सद्रक्षणाय खलनिग्रहणाय." },
      { property: "og:title", content: "Maharashtra Police — Guardians of the State" },
      { property: "og:description", content: "Witness the birth of an icon. A scroll-driven cinematic tribute to India's largest state police force." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-[#0d0d0d] text-white page-fade">
      <CustomCursor />
      <ScrollProgress />
      <FullscreenToggle />
      <PortalGate />
      <BadgeScroll />
      <Suspense fallback={<div className="h-32" />}>
        <FraudLensSection />
        <CommissioneratesSection />
        <ContactSection />
      </Suspense>
    </main>
  );
}
