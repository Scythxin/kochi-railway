import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp,
  AlertTriangle,
  Target,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MileageData {
  trainsetId: string;
  unitNumber: string;
  currentMileage: number;
  targetMileage: number;
  deviation: number;
  componentWear: {
    wheels: number;
    brakes: number;
    hvac: number;
    motors: number;
  };
}

interface MileageBalancerProps {
  mileageData: MileageData[];
}

export function MileageBalancer({ mileageData }: MileageBalancerProps) {
  const getDeviationColor = (deviation: number) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation <= 5) return 'hsl(var(--status-operational))';
    if (absDeviation <= 10) return 'hsl(var(--status-standby))';
    return 'hsl(var(--status-maintenance))';
  };

  const getWearColor = (wear: number) => {
    if (wear <= 30) return 'text-status-operational';
    if (wear <= 60) return 'text-status-standby';
    return 'text-status-maintenance';
  };

  const chartData = mileageData.map(d => ({
    name: d.unitNumber,
    mileage: d.currentMileage,
    target: d.targetMileage,
    deviation: d.deviation
  }));

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold">Mileage Balancing</h2>
          <p className="text-sm text-muted-foreground">
            Component wear indicators and mileage distribution
          </p>
        </div>

        {/* Mileage Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Fleet Mileage Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="mileage" name="Current Mileage">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getDeviationColor(entry.deviation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Component Wear Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Component Wear Levels</h3>
          {mileageData.map((data) => {
            const avgWear = (
              data.componentWear.wheels + 
              data.componentWear.brakes + 
              data.componentWear.hvac + 
              data.componentWear.motors
            ) / 4;

            return (
              <Card key={data.trainsetId} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{data.unitNumber}</h4>
                        {Math.abs(data.deviation) > 10 && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            High Deviation
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-muted-foreground">
                          <Gauge className="inline h-3 w-3 mr-1" />
                          {data.currentMileage.toLocaleString()} km
                        </span>
                        <span className="text-muted-foreground">
                          <Target className="inline h-3 w-3 mr-1" />
                          Target: {data.targetMileage.toLocaleString()} km
                        </span>
                        <span className={cn(
                          'font-medium',
                          Math.abs(data.deviation) <= 5 && 'text-status-operational',
                          Math.abs(data.deviation) > 5 && Math.abs(data.deviation) <= 10 && 'text-status-standby',
                          Math.abs(data.deviation) > 10 && 'text-status-maintenance'
                        )}>
                          {data.deviation > 0 ? '+' : ''}{data.deviation}% deviation
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Avg Wear</p>
                      <p className={cn('text-2xl font-bold', getWearColor(avgWear))}>
                        {avgWear.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Component Wear Indicators */}
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(data.componentWear).map(([component, wear]) => (
                      <div key={component} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground capitalize">
                            {component}
                          </span>
                          <span className={cn('text-xs font-bold', getWearColor(wear))}>
                            {wear}%
                          </span>
                        </div>
                        <Progress value={wear} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}