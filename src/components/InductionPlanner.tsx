import { useState } from 'react';
import { InductionDecision, Trainset } from '@/types/fleet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info,
  PlayCircle,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface InductionPlannerProps {
  decisions: InductionDecision[];
  trainsets: Trainset[];
  onSimulate?: () => void;
  onRefresh?: () => void;
  onOverride?: (trainsetId: string) => void;
}

export function InductionPlanner({ 
  decisions, 
  trainsets, 
  onSimulate, 
  onRefresh,
  onOverride 
}: InductionPlannerProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (trainsetId: string) => {
    setExpandedItems(prev => 
      prev.includes(trainsetId) 
        ? prev.filter(id => id !== trainsetId)
        : [...prev, trainsetId]
    );
  };

  const getAssignmentColor = (assignment: string) => {
    switch (assignment) {
      case 'service':
        return 'bg-status-operational/10 text-status-operational border-status-operational/30';
      case 'standby':
        return 'bg-status-standby/10 text-status-standby border-status-standby/30';
      case 'maintenance':
        return 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-operational';
    if (score >= 60) return 'text-status-standby';
    return 'text-status-maintenance';
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Induction Planner</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered trainset assignment with explainable reasoning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onSimulate}
              className="gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              Simulate
            </Button>
          </div>
        </div>

        {/* Decision List */}
        <div className="space-y-3">
          {decisions.map((decision) => {
            const trainset = trainsets.find(t => t.id === decision.trainsetId);
            if (!trainset) return null;

            const isExpanded = expandedItems.includes(decision.trainsetId);

            return (
              <Collapsible
                key={decision.trainsetId}
                open={isExpanded}
                onOpenChange={() => toggleExpanded(decision.trainsetId)}
              >
                <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                  <CollapsibleTrigger className="w-full">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{trainset.unitNumber}</h4>
                              <Badge 
                                variant="outline"
                                className={cn('uppercase', getAssignmentColor(decision.assignment))}
                              >
                                {decision.assignment}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {trainset.depot} • {trainset.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className={cn('text-2xl font-bold', getScoreColor(decision.score))}>
                              {decision.score}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {decision.conflicts && decision.conflicts.length > 0 && (
                              <AlertTriangle className="w-5 h-5 text-status-standby" />
                            )}
                            <div className="text-muted-foreground">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score Progress Bar */}
                      <div className="mt-3">
                        <Progress value={decision.score} className="h-1" />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3 border-t pt-3">
                      {/* Reasoning */}
                      <div>
                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-status-operational" />
                          Reasoning
                        </h5>
                        <ul className="space-y-1">
                          {decision.reasoning.map((reason, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Conflicts */}
                      {decision.conflicts && decision.conflicts.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-status-standby" />
                            Conflicts
                          </h5>
                          <ul className="space-y-1">
                            {decision.conflicts.map((conflict, idx) => (
                              <li key={idx} className="text-sm text-status-standby">
                                {conflict}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Alternative Options */}
                      {decision.alternativeOptions && decision.alternativeOptions.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <Info className="w-4 h-4 text-accent" />
                            Alternative Options
                          </h5>
                          <ul className="space-y-1">
                            {decision.alternativeOptions.map((option, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOverride?.(decision.trainsetId)}
                          className="gap-1"
                        >
                          <Settings className="w-3 h-3" />
                          Override Decision
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </Card>
  );
}