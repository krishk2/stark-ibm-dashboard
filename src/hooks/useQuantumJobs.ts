import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuantumJob {
  id: string;
  name: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  backend: string;
  shots: number;
  qubits: number;
  submittedAt: string;
  estimatedCompletion?: string;
  progress?: number;
  user: string;
  circuit: string;
}

export interface QuantumStats {
  total: number;
  running: number;
  queued: number;
  completed: number;
  failed: number;
}

export const useQuantumJobs = () => {
  const [jobs, setJobs] = useState<QuantumJob[]>([]);
  const [stats, setStats] = useState<QuantumStats>({
    total: 0,
    running: 0,
    queued: 0,
    completed: 0,
    failed: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      console.log('Fetching quantum jobs from edge function...');
      
      const { data, error } = await supabase.functions.invoke('fetch-quantum-jobs');
      
      if (error) {
        console.error('Error calling edge function:', error);
        return;
      }

      if (data?.jobs && data?.stats) {
        console.log('Successfully fetched jobs:', data.jobs.length);
        setJobs(data.jobs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching quantum jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    // Refresh jobs every 30 seconds for real-time feel
    const interval = setInterval(fetchJobs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    jobs,
    stats,
    isLoading,
    refreshJobs: fetchJobs
  };
};