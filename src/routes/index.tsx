import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import BadgeScroll from "@/components/BadgeScroll";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import PortalGate from "@/components/PortalGate";

const StatsSection = lazy(() => import("@/components/StatsSection"));
const ValuesSection = lazy(() => import("@/components/ValuesSection"));
const TimelineSection = lazy(() => import("@/components/TimelineSection"));
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
      <Navbar />
      <PortalGate />
      <BadgeScroll />
      <Suspense fallback={<div className="h-32" />}>
        <StatsSection />
        <ValuesSection />
        <TimelineSection />
        <CommissioneratesSection />
        <ContactSection />
      </Suspense>
    </main>
  );
}
