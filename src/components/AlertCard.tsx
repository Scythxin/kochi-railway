import { Alert } from '@/types/fleet';
import { StatusBadge } from './StatusBadge';
import { Clock, AlertTriangle, Info, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: () => void;
  onAction?: () => void;
}

export function AlertCard({ alert, onDismiss, onAction }: AlertCardProps) {
  const getIcon = () => {
    switch (alert.severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-status-maintenance" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-status-standby" />;
      default:
        return <Info className="w-5 h-5 text-status-inactive" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className={cn(
      'p-4 transition-all hover:shadow-md',
      alert.severity === 'critical' && 'border-status-maintenance/30 bg-status-maintenance/5',
      alert.severity === 'warning' && 'border-status-standby/30 bg-status-standby/5'
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{alert.title}</h4>
                <StatusBadge status={alert.severity} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {alert.description}
              </p>
              {alert.actionRequired && (
                <p className="text-xs text-primary font-medium">
                  Action: {alert.actionRequired}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeAgo(alert.timestamp)}
                </span>
                {alert.trainsetId && (
                  <span className="text-xs text-muted-foreground">
                    Unit: {alert.trainsetId}
                  </span>
                )}
              </div>
            </div>
          </div>
          {(onAction || onDismiss) && (
            <div className="flex items-center gap-2 mt-3">
              {onAction && (
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 text-xs"
                  onClick={onAction}
                >
                  Take Action
                </Button>
              )}
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={onDismiss}
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}