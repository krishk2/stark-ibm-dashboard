import { useState, useEffect } from 'react';

interface Job {
  id: string;
  status: 'running' | 'queued' | 'completed' | 'error' | 'cancelled';
  backend: string;
  qubits: number;
  shots: number;
  createdAt: string;
  executionTime?: number;
}

// Mock data generator - in a real app, this would call IBM Quantum API
const generateMockJob = (): Job => {
  const backends = ['ibm_brisbane', 'ibm_kyoto', 'ibm_osaka', 'ibm_quebec', 'simulator_mps'];
  const statuses: Job['status'][] = ['running', 'queued', 'completed', 'error', 'cancelled'];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    backend: backends[Math.floor(Math.random() * backends.length)],
    qubits: Math.floor(Math.random() * 127) + 1,
    shots: Math.floor(Math.random() * 8192) + 1024,
    createdAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    executionTime: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 10 : undefined
  };
};

export const useQuantumJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const initialJobs = Array.from({ length: 12 }, generateMockJob);
    setJobs(initialJobs);
    setIsLoading(false);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs => {
        // Sometimes add a new job
        if (Math.random() > 0.7) {
          const newJob = generateMockJob();
          return [newJob, ...prevJobs.slice(0, 11)];
        }
        
        // Sometimes update existing job status
        return prevJobs.map(job => {
          if (job.status === 'queued' && Math.random() > 0.8) {
            return { ...job, status: 'running' as const };
          }
          if (job.status === 'running' && Math.random() > 0.9) {
            return { 
              ...job, 
              status: 'completed' as const, 
              executionTime: Math.floor(Math.random() * 300) + 10 
            };
          }
          return job;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: jobs.length,
    running: jobs.filter(j => j.status === 'running').length,
    queued: jobs.filter(j => j.status === 'queued').length,
    completed: jobs.filter(j => j.status === 'completed').length
  };

  return { jobs, isLoading, stats };
};