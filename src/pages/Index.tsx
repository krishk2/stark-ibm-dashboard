import { Activity, Clock, Cpu, Zap } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { StatsCard } from "@/components/StatsCard";
import { useQuantumJobs } from "@/hooks/useQuantumJobs";

const Index = () => {
  const { jobs, isLoading, stats } = useQuantumJobs();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quantum jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-quantum rounded-lg flex items-center justify-center shadow-glow">
              <Cpu className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">IBM Quantum Dashboard</h1>
              <p className="text-sm text-muted-foreground">Live quantum computing jobs</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Jobs"
            value={stats.total}
            icon={Activity}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Running"
            value={stats.running}
            icon={Zap}
          />
          <StatsCard
            title="Queued"
            value={stats.queued}
            icon={Clock}
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={Cpu}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Jobs Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Jobs</h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-quantum-running rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live updates</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
