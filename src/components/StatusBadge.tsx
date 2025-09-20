import { cn } from '@/lib/utils';
import { TrainsetStatus, CertificateStatus } from '@/types/fleet';

interface StatusBadgeProps {
  status: TrainsetStatus | CertificateStatus | 'critical' | 'warning' | 'info';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'operational':
      case 'valid':
        return 'bg-status-operational/20 text-status-operational border-status-operational/30';
      case 'standby':
      case 'expiring':
      case 'warning':
        return 'bg-status-standby/20 text-status-standby border-status-standby/30';
      case 'maintenance':
      case 'expired':
      case 'critical':
        return 'bg-status-maintenance/20 text-status-maintenance border-status-maintenance/30';
      case 'inactive':
      case 'info':
        return 'bg-status-inactive/20 text-status-inactive border-status-inactive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'standby':
        return 'Standby';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactive';
      case 'valid':
        return 'Valid';
      case 'expiring':
        return 'Expiring';
      case 'expired':
        return 'Expired';
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {getStatusLabel()}
    </span>
  );
}