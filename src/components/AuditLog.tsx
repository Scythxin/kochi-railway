import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText,
  Download,
  User,
  Calendar,
  Edit,
  Shield,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  category: 'override' | 'system' | 'manual' | 'automated';
  details: string;
  justification?: string;
  trainsetId?: string;
}

interface AuditLogProps {
  entries: AuditEntry[];
  onExport?: () => void;
  onFilter?: () => void;
}

export function AuditLog({ entries, onExport, onFilter }: AuditLogProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'override':
        return 'bg-status-standby/10 text-status-standby border-status-standby/30';
      case 'manual':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'automated':
        return 'bg-accent/10 text-accent border-accent/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'override':
        return <Edit className="h-3 w-3" />;
      case 'manual':
        return <User className="h-3 w-3" />;
      case 'automated':
        return <Shield className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Audit Log</h2>
            <p className="text-sm text-muted-foreground">
              Track all decisions and changes for compliance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Audit Entries */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs gap-1', getCategoryColor(entry.category))}
                        >
                          {getCategoryIcon(entry.category)}
                          {entry.category}
                        </Badge>
                        {entry.trainsetId && (
                          <Badge variant="outline" className="text-xs">
                            Unit {entry.trainsetId}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{entry.action}</h4>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      {entry.justification && (
                        <div className="mt-2 p-2 bg-muted/50 rounded">
                          <p className="text-xs text-muted-foreground">Justification:</p>
                          <p className="text-sm">{entry.justification}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.user}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}