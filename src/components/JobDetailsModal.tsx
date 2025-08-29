import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { QuantumJob } from "@/hooks/useQuantumJobs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts";
import { Clock, Cpu, Zap, User, Calendar, Activity, Gauge, BarChart3 } from "lucide-react";

interface JobDetailsModalProps {
  job: QuantumJob | null;
  isOpen: boolean;
  onClose: () => void;
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

const chartConfig = {
  executed: {
    label: "Executed",
    color: "hsl(var(--quantum-completed))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--muted))",
  },
  success: {
    label: "Success Rate",
    color: "hsl(var(--quantum-completed))",
  },
  error: {
    label: "Error Rate",
    color: "hsl(var(--quantum-error))",
  },
};

export const JobDetailsModal = ({ job, isOpen, onClose }: JobDetailsModalProps) => {
  if (!job) return null;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Generate sample data for charts based on job properties
  const executionData = [
    { name: "Executed", value: job.progress || 0, fill: "hsl(var(--quantum-completed))" },
    { name: "Remaining", value: 100 - (job.progress || 0), fill: "hsl(var(--muted))" }
  ];

  const performanceData = [
    { name: "Success Rate", value: 95.2, fill: "hsl(var(--quantum-completed))" },
    { name: "Error Rate", value: 4.8, fill: "hsl(var(--quantum-error))" }
  ];

  const qubitUtilization = Array.from({ length: job.qubits }, (_, i) => ({
    qubit: `Q${i}`,
    utilization: Math.random() * 100,
  }));

  const timeSeriesData = Array.from({ length: 10 }, (_, i) => ({
    time: `T${i + 1}`,
    fidelity: 85 + Math.random() * 10,
    gateTime: 20 + Math.random() * 5,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{job.name}</DialogTitle>
            <Badge className={`${statusColors[job.status]} flex items-center gap-1.5`}>
              {statusIcons[job.status]}
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Cpu className="h-4 w-4" />
                Backend
              </div>
              <p className="font-semibold text-lg">{job.backend}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Activity className="h-4 w-4" />
                Qubits
              </div>
              <p className="font-semibold text-lg">{job.qubits}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <BarChart3 className="h-4 w-4" />
                Shots
              </div>
              <p className="font-semibold text-lg">{job.shots.toLocaleString()}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <User className="h-4 w-4" />
                User
              </div>
              <p className="font-semibold text-lg">{job.user}</p>
            </div>
          </div>

          {/* Progress Bar for Running Jobs */}
          {job.progress && job.status === 'running' && (
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Execution Progress</span>
                <span className="text-sm text-muted-foreground">{job.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-quantum-running h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Charts Tabs */}
          <Tabs defaultValue="execution" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="execution">Execution</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="qubits">Qubits</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="execution" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Execution Progress
                </h3>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={executionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {executionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Success Rate Analysis
                </h3>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="qubits" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Qubit Utilization
                </h3>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qubitUtilization}>
                      <XAxis dataKey="qubit" />
                      <YAxis />
                      <Bar dataKey="utilization" fill="hsl(var(--primary))" radius={4} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Performance Timeline
                </h3>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Line 
                        type="monotone" 
                        dataKey="fidelity" 
                        stroke="hsl(var(--quantum-completed))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--quantum-completed))" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gateTime" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Calendar className="h-4 w-4" />
                Submitted
              </div>
              <p className="font-medium">{formatDate(job.submittedAt)} at {formatTime(job.submittedAt)}</p>
            </div>
            {job.estimatedCompletion && (
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Clock className="h-4 w-4" />
                  Estimated Completion
                </div>
                <p className="font-medium">{formatDate(job.estimatedCompletion)} at {formatTime(job.estimatedCompletion)}</p>
              </div>
            )}
          </div>

          {/* Circuit Details */}
          <div className="bg-card p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Circuit Details</h4>
            <p className="text-sm text-muted-foreground font-mono break-all">{job.circuit}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};