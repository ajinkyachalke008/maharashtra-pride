import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import GlobalSidebar from '@/components/fraudlens/GlobalSidebar';
import TopBar from '@/components/fraudlens/TopBar';

export const Route = createFileRoute('/fraudlens')({
  component: FraudLensLayout,
});

function FraudLensLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background-base text-white flex overflow-hidden relative">
      {/* Global Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none z-0" />
      
      {/* Global Navigation Sidebar */}
      <GlobalSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[72px] relative z-10">
        {/* Top Header Bar */}
        <TopBar />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
