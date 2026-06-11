import { useQuery } from '@tanstack/react-query';

// For local development with FastAPI + Neo4j backend
import { API_BASE_URL } from '../config';

const API_BASE = `${API_BASE_URL}/api/v1`;

const getHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('fraudlens_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
export interface CaseAlert {
  id: string;
  case_number: string;
  title: string;
  status: string;
  priority: string;
  amount: number;
  total_amount?: number;
  created_at: string | null;
}

interface TelemetryData {
  telemetry: {
    threat_level: string;
    total_protected_value: number;
    active_cases: number;
  };
  recent_alerts: CaseAlert[];
}

interface StreamMetrics {
  active_websocket_clients: number | null;
  messages_processed: number | null;
  high_risk_flags: number | null;
  last_processed_time: string | null;
  error?: string;
}

export function useDashboardTelemetry() {
  return useQuery<TelemetryData>({
    queryKey: ['dashboard', 'telemetry'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/dashboard/telemetry`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch telemetry');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    },
    refetchInterval: 10000,
    retry: 1,
  });
}

export function useStreamMetrics() {
  return useQuery<StreamMetrics>({
    queryKey: ['stream', 'metrics'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/ws/metrics`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stream metrics');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    },
    refetchInterval: 5000,
    retry: 1,
  });
}

export function useCases(status?: string, priority?: string) {
  return useQuery({
    queryKey: ['cases', status, priority],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (priority) params.set('priority', priority);
      params.set('limit', '10');
      const res = await fetch(`${API_BASE}/cases/?${params.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    refetchInterval: 15000,
    retry: 1,
  });
}

export interface LatentNode {
  id: string;
  x: number;
  y: number;
  cluster: string;
  risk_score: number;
  volume: number;
}

export function useLatentSpace() {
  return useQuery<{ nodes: LatentNode[]; engine: string }>({
    queryKey: ['ml', 'latentSpace'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/ml/latent-space`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch latent space data');
      return res.json();
    },
    refetchInterval: 10000,
  });
}

export interface SyndicateMule {
  account: string;
  volume: number;
  cases: string[];
  legal_sections: string[];
}

export function useSyndicates() {
  return useQuery<{ total_syndicates_detected: number; mules: SyndicateMule[]; engine: string }>({
    queryKey: ['intelligence', 'syndicates'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/intelligence/syndicates`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch syndicates data');
      return res.json();
    },
    refetchInterval: 10000,
  });
}
