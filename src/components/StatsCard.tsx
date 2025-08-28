import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, icon: Icon, trend }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-quantum transition-all duration-300 bg-gradient-glow border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={`text-sm ${trend.isPositive ? 'text-quantum-completed' : 'text-quantum-error'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}% from yesterday
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-gradient-quantum rounded-xl flex items-center justify-center shadow-glow">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};