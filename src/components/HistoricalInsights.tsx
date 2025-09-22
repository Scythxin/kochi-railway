import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Brain,
  History,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoricalData {
  date: string;
  availability: number;
  punctuality: number;
  mileage: number;
  maintenance: number;
}

interface PredictionData {
  component: string;
  currentHealth: number;
  predictedFailure: string;
  confidence: number;
  recommendation: string;
}

interface HistoricalInsightsProps {
  historicalData: HistoricalData[];
  predictions: PredictionData[];
  accuracyScore: number;
  onExport?: () => void;
}

export function HistoricalInsights({ 
  historicalData, 
  predictions, 
  accuracyScore,
  onExport 
}: HistoricalInsightsProps) {
  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-status-operational';
    if (health >= 60) return 'text-status-standby';
    return 'text-status-maintenance';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-status-operational/10 text-status-operational';
    if (confidence >= 60) return 'bg-status-standby/10 text-status-standby';
    return 'bg-status-maintenance/10 text-status-maintenance';
  };

  return (
    <div className="space-y-6">
      {/* ML Accuracy Score */}
      <Card className="p-6 bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">ML Model Performance</h2>
              <p className="text-sm text-muted-foreground">
                Prediction accuracy based on historical data
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{accuracyScore}%</p>
            <p className="text-xs text-muted-foreground">Accuracy Score</p>
          </div>
        </div>
        <Progress value={accuracyScore} className="h-3" />
      </Card>

      {/* Historical Performance Charts */}
      <Card className="p-6 bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Historical Performance</h3>
          </div>
          <Button size="sm" variant="outline" onClick={onExport}>
            Export Data
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Availability & Punctuality Chart */}
          <div>
            <h4 className="text-sm font-medium mb-3">Fleet Metrics</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
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
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="availability" 
                  stroke="hsl(var(--status-operational))" 
                  strokeWidth={2}
                  name="Availability %"
                />
                <Line 
                  type="monotone" 
                  dataKey="punctuality" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Punctuality %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mileage Trend Chart */}
          <div>
            <h4 className="text-sm font-medium mb-3">Mileage & Maintenance</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
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
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="mileage" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  name="Mileage (km)"
                />
                <Area 
                  type="monotone" 
                  dataKey="maintenance" 
                  stroke="hsl(var(--status-standby))" 
                  fill="hsl(var(--status-standby))"
                  fillOpacity={0.3}
                  name="Maintenance Events"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Predictive Maintenance */}
      <Card className="p-6 bg-gradient-card">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">Predictive Maintenance Insights</h3>
        </div>

        <div className="space-y-3">
          {predictions.map((prediction, idx) => (
            <Card key={idx} className="p-4 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{prediction.component}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn('text-xs', getConfidenceColor(prediction.confidence))}
                    >
                      {prediction.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Health:</span>
                      <span className={cn('font-bold', getHealthColor(prediction.currentHealth))}>
                        {prediction.currentHealth}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-status-standby" />
                      <span className="text-muted-foreground">Predicted failure:</span>
                      <span className="font-medium">{prediction.predictedFailure}</span>
                    </div>
                  </div>

                  <Progress value={prediction.currentHealth} className="h-1" />
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                  <p className="text-sm font-medium text-primary">
                    {prediction.recommendation}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}