import { Trainset } from '@/types/fleet';
import { StatusBadge } from './StatusBadge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Gauge, 
  MapPin, 
  Wrench, 
  Award, 
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainsetCardProps {
  trainset: Trainset;
  onClick?: () => void;
  selected?: boolean;
}

export function TrainsetCard({ trainset, onClick, selected }: TrainsetCardProps) {
  const getExpiringCertificates = () => {
    return trainset.certificates.filter(c => c.status === 'expiring' || c.status === 'expired');
  };

  const getFitnessColor = (fitness: number) => {
    if (fitness >= 80) return 'text-status-operational';
    if (fitness >= 60) return 'text-status-standby';
    return 'text-status-maintenance';
  };

  return (
    <Card 
      className={cn(
        'p-3 sm:p-4 cursor-pointer transition-all hover:shadow-lg',
        'border-2',
        selected ? 'border-primary shadow-glow' : 'border-border',
        'bg-gradient-card'
      )}
      onClick={onClick}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg">{trainset.unitNumber}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">ID: {trainset.id}</p>
          </div>
          <StatusBadge status={trainset.status} />
        </div>

        {/* Fitness Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              Fitness Score
            </span>
            <span className={cn('font-bold', getFitnessColor(trainset.fitness))}>
              {trainset.fitness}%
            </span>
          </div>
          <Progress 
            value={trainset.fitness} 
            className="h-2"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">{trainset.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Mileage</p>
              <p className="font-medium">{trainset.mileage.toLocaleString()} km</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Next Maint.</p>
              <p className="font-medium">
                {trainset.nextMaintenance.toLocaleDateString()}
              </p>
            </div>
          </div>

          {trainset.assignedService && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="font-medium">{trainset.assignedService}</p>
              </div>
            </div>
          )}
        </div>

        {/* Warnings */}
        {getExpiringCertificates().length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-status-standby/10 rounded-md">
            <AlertCircle className="w-4 h-4 text-status-standby" />
            <span className="text-xs text-status-standby">
              {getExpiringCertificates().length} certificate(s) need attention
            </span>
          </div>
        )}

        {/* Branding */}
        {trainset.brandingType && (
          <div className="flex items-center justify-between p-2 bg-accent/10 rounded-md">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium">{trainset.brandingType}</span>
            </div>
            {trainset.exposureHours && (
              <span className="text-xs text-muted-foreground">
                {trainset.exposureHours}h exposure
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}