import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Eye,
  Target,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandingData {
  trainsetId: string;
  unitNumber: string;
  brandingType: string;
  requiredHours: number;
  actualHours: number;
  slaCompliance: number;
  revenueRisk: number;
  priority: 'high' | 'medium' | 'low';
}

interface BrandingInsightsProps {
  brandingData: BrandingData[];
  onPriorityChange?: (trainsetId: string, priority: string) => void;
}

export function BrandingInsights({ brandingData, onPriorityChange }: BrandingInsightsProps) {
  const totalRevenueRisk = brandingData.reduce((sum, b) => sum + b.revenueRisk, 0);
  const avgCompliance = brandingData.reduce((sum, b) => sum + b.slaCompliance, 0) / brandingData.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/30';
      case 'medium':
        return 'bg-status-standby/10 text-status-standby border-status-standby/30';
      case 'low':
        return 'bg-status-operational/10 text-status-operational border-status-operational/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-status-operational';
    if (compliance >= 70) return 'text-status-standby';
    return 'text-status-maintenance';
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Branding & Marketing Insights</h2>
            <p className="text-sm text-muted-foreground">
              Track exposure hours and SLA compliance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Revenue at Risk</p>
              <p className="text-xl font-bold text-status-maintenance">
                ${totalRevenueRisk.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg Compliance</p>
              <p className={cn('text-xl font-bold', getComplianceColor(avgCompliance))}>
                {avgCompliance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Total Exposure</p>
                <p className="text-sm font-bold">
                  {brandingData.reduce((sum, b) => sum + b.actualHours, 0).toLocaleString()}h
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Target Hours</p>
                <p className="text-sm font-bold">
                  {brandingData.reduce((sum, b) => sum + b.requiredHours, 0).toLocaleString()}h
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-status-operational" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Active Campaigns</p>
                <p className="text-sm font-bold">{brandingData.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Branding List */}
        <div className="space-y-3">
          {brandingData.map((branding) => {
            const exposurePercentage = (branding.actualHours / branding.requiredHours) * 100;
            const isAtRisk = exposurePercentage < 80;

            return (
              <Card key={branding.trainsetId} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{branding.unitNumber}</h4>
                          <Badge 
                            variant="outline"
                            className={cn('uppercase text-xs', getPriorityColor(branding.priority))}
                          >
                            {branding.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {branding.brandingType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isAtRisk && (
                        <div className="flex items-center gap-1 text-status-standby">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">SLA Risk</span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Revenue Risk</p>
                        <p className="text-sm font-bold text-status-maintenance">
                          ${branding.revenueRisk.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Exposure Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Exposure Hours</span>
                      <span className={cn('font-medium', getComplianceColor(exposurePercentage))}>
                        {branding.actualHours}h / {branding.requiredHours}h
                      </span>
                    </div>
                    <Progress value={exposurePercentage} className="h-2" />
                  </div>

                  {/* SLA Compliance */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">SLA Compliance:</span>
                      <span className={cn('text-sm font-bold', getComplianceColor(branding.slaCompliance))}>
                        {branding.slaCompliance}%
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPriorityChange?.(branding.trainsetId, branding.priority)}
                    >
                      Adjust Priority
                    </Button>
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