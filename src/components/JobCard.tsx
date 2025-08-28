import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Cpu, Zap } from "lucide-react";

interface Job {
  id: string;
  status: 'running' | 'queued' | 'completed' | 'error' | 'cancelled';
  backend: string;
  qubits: number;
  shots: number;
  createdAt: string;
  executionTime?: number;
}

interface JobCardProps {
  job: Job;
}

const statusIcons = {
  running: <Zap className="h-4 w-4" />,
  queued: <Clock className="h-4 w-4" />,
  completed: <Cpu className="h-4 w-4" />,
  error: <Zap className="h-4 w-4" />,
  cancelled: <Clock className="h-4 w-4" />
};

const statusColors = {
  running: "bg-quantum-running/10 text-quantum-running border-quantum-running/20",
  queued: "bg-quantum-queued/10 text-quantum-queued border-quantum-queued/20",
  completed: "bg-quantum-completed/10 text-quantum-completed border-quantum-completed/20",
  error: "bg-quantum-error/10 text-quantum-error border-quantum-error/20",
  cancelled: "bg-quantum-cancelled/10 text-quantum-cancelled border-quantum-cancelled/20"
};

export const JobCard = ({ job }: JobCardProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <Card className="hover:shadow-quantum transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Job {job.id.slice(-8)}
          </CardTitle>
          <Badge className={`${statusColors[job.status]} flex items-center gap-1.5`}>
            {statusIcons[job.status]}
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Backend:</span>
            <p className="font-medium text-foreground">{job.backend}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Qubits:</span>
            <p className="font-medium text-foreground">{job.qubits}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Shots:</span>
            <p className="font-medium text-foreground">{job.shots.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <p className="font-medium text-foreground">{formatTime(job.createdAt)}</p>
          </div>
        </div>
        {job.executionTime && (
          <div className="pt-2 border-t border-border/50">
            <span className="text-muted-foreground text-sm">Execution Time:</span>
            <p className="font-medium text-foreground">{job.executionTime}s</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};