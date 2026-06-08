import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { LayoutGrid, List, Search, Loader2 } from 'lucide-react';
import CaseTable from '@/components/fraudlens/cases/CaseTable';
import KanbanBoard from '@/components/fraudlens/cases/KanbanBoard';

import { useCases } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';

import { API_BASE_URL } from '../../config';

// ...
export const Route = createFileRoute('/fraudlens/cases')({
  component: CaseExplorerPage,
});

function CaseExplorerPage() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, refetch } = useCases();
  const cases = data?.cases || [];
  
  const { user, setUserRole } = useAuth();

  const handleStatusChange = async (caseId: string, newStatus: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      refetch(); // Refresh data from backend
    } catch (e) {
      console.error("Failed to update case status", e);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Case Explorer</h1>
            <p className="text-white/40 mt-2">Manage active investigations, track evidence, and assign workflows.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background-surface border border-white/5 rounded-lg px-3 py-1">
              <span className="text-xs font-mono text-white/40">ROLE:</span>
              <select 
                value={user.role}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="bg-transparent text-primary-400 text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value="DSP">DSP (Admin)</option>
                <option value="Analyst">Crime Analyst</option>
                <option value="DataOfficer">Data Officer</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search case # or suspect..."
                className="bg-background-surface border border-white/5 rounded-lg pl-9 pr-4 py-2 font-mono text-sm focus:border-primary-500 focus:outline-none w-64 text-white"
              />
            </div>
            
            <div className="flex bg-background-surface rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => setView('table')}
                className={`p-2 rounded-md transition-colors ${view === 'table' ? 'bg-background-card text-primary-400 shadow' : 'text-white/40 hover:text-white'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('kanban')}
                className={`p-2 rounded-md transition-colors ${view === 'kanban' ? 'bg-background-card text-primary-400 shadow' : 'text-white/40 hover:text-white'}`}
                title="Kanban View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : view === 'table' ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
             <CaseTable cases={cases} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <KanbanBoard cases={cases} onStatusChange={handleStatusChange} />
          </div>
        )}

      </div>
    </div>
  );
}
