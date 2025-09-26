import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function KPICard({
  title,
  value,
  unit,
  change,
  trend,
  icon,
  className,
  variant = 'default'
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-status-operational/30 bg-gradient-to-br from-status-operational/10 to-transparent';
      case 'warning':
        return 'border-status-standby/30 bg-gradient-to-br from-status-standby/10 to-transparent';
      case 'danger':
        return 'border-status-maintenance/30 bg-gradient-to-br from-status-maintenance/10 to-transparent';
      default:
        return 'border-border bg-gradient-card';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-3 h-3" />;
      case 'down':
        return <ArrowDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = () => {
    if (!trend || !change) return 'text-muted-foreground';
    
    if (trend === 'up') {
      return change > 0 ? 'text-status-operational' : 'text-status-maintenance';
    }
    if (trend === 'down') {
      return change < 0 ? 'text-status-maintenance' : 'text-status-operational';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-lg',
      getVariantStyles(),
      className
    )}>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1 truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground">
                {value}
              </h3>
              {unit && (
                <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
            {change !== undefined && (
              <div className={cn('flex items-center gap-1 mt-1 sm:mt-2', getTrendColor())}>
                {getTrendIcon()}
                <span className="text-xs sm:text-sm font-medium">
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 sm:p-3 rounded-lg bg-primary/10 scale-75 sm:scale-90 md:scale-100">
              {icon}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 p-2 opacity-10">
        <TrendingUp className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24" />
      </div>
    </Card>
  );
}