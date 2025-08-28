import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Cpu, Zap, User, Calendar } from "lucide-react";
import { QuantumJob } from "@/hooks/useQuantumJobs";

interface JobCardProps {
  job: QuantumJob;
}

const statusIcons = {
  running: <Zap className="h-4 w-4" />,
  queued: <Clock className="h-4 w-4" />,
  completed: <Cpu className="h-4 w-4" />,
  failed: <Zap className="h-4 w-4" />
};

const statusColors = {
  running: "bg-quantum-running/10 text-quantum-running border-quantum-running/20",
  queued: "bg-quantum-queued/10 text-quantum-queued border-quantum-queued/20",
  completed: "bg-quantum-completed/10 text-quantum-completed border-quantum-completed/20",
  failed: "bg-quantum-error/10 text-quantum-error border-quantum-error/20"
};

export const JobCard = ({ job }: JobCardProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-quantum transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {job.name}
          </CardTitle>
          <Badge className={`${statusColors[job.status]} flex items-center gap-1.5`}>
            {statusIcons[job.status]}
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <span className="text-muted-foreground">Circuit:</span>
            <p className="font-medium text-foreground text-xs truncate" title={job.circuit}>
              {job.circuit}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{job.user}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Submitted: {formatDate(job.submittedAt)} at {formatTime(job.submittedAt)}</span>
        </div>

        {job.progress && job.status === 'running' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{job.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-quantum-running h-2 rounded-full transition-all duration-300" 
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {job.estimatedCompletion && (job.status === 'running' || job.status === 'queued') && (
          <div className="pt-2 border-t border-border/50">
            <span className="text-muted-foreground text-sm">Estimated completion:</span>
            <p className="font-medium text-foreground text-sm">
              {formatDate(job.estimatedCompletion)} at {formatTime(job.estimatedCompletion)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};