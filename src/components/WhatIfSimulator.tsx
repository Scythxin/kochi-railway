import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  RotateCcw,
  Save,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  GitCompare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InductionDecision } from '@/types/fleet';

interface SimulationResult {
  kpiChanges: {
    availability: number;
    punctuality: number;
    mileageBalance: number;
    brandingCompliance: number;
  };
  conflicts: string[];
  recommendations: string[];
}

interface WhatIfSimulatorProps {
  originalDecisions: InductionDecision[];
  modifiedDecisions: InductionDecision[];
  simulationResult?: SimulationResult;
  onSimulate: () => void;
  onReset: () => void;
  onApply: () => void;
  onDecisionChange: (trainsetId: string, newAssignment: string) => void;
}

export function WhatIfSimulator({
  originalDecisions,
  modifiedDecisions,
  simulationResult,
  onSimulate,
  onReset,
  onApply,
  onDecisionChange
}: WhatIfSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onSimulate();
      setIsSimulating(false);
    }, 1500);
  };

  const getChangeIndicator = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-status-operational">
          <TrendingUp className="h-3 w-3" />
          <span className="text-xs font-medium">+{value}%</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-status-maintenance">
          <TrendingDown className="h-3 w-3" />
          <span className="text-xs font-medium">{value}%</span>
        </div>
      );
    }
    return <span className="text-xs text-muted-foreground">No change</span>;
  };

  const hasChanges = JSON.stringify(originalDecisions) !== JSON.stringify(modifiedDecisions);

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold">What-If Simulation</h2>
              <p className="text-sm text-muted-foreground">
                Test alternative induction scenarios
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!hasChanges}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSimulate}
              disabled={!hasChanges || isSimulating}
              className="gap-2"
            >
              {isSimulating ? (
                <>
                  <Zap className="h-4 w-4 animate-pulse" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Simulate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Simulation Results */}
        {simulationResult && (
          <div className="space-y-4">
            {/* KPI Impact */}
            <Card className="p-4 bg-card/50">
              <h3 className="text-sm font-semibold mb-3">Projected KPI Impact</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fleet Availability</p>
                  {getChangeIndicator(simulationResult.kpiChanges.availability)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Punctuality</p>
                  {getChangeIndicator(simulationResult.kpiChanges.punctuality)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mileage Balance</p>
                  {getChangeIndicator(simulationResult.kpiChanges.mileageBalance)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Branding Compliance</p>
                  {getChangeIndicator(simulationResult.kpiChanges.brandingCompliance)}
                </div>
              </div>
            </Card>

            {/* Conflicts */}
            {simulationResult.conflicts.length > 0 && (
              <Card className="p-4 bg-status-standby/5 border-status-standby/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-status-standby" />
                  <h3 className="text-sm font-semibold">Potential Conflicts</h3>
                </div>
                <ul className="space-y-1">
                  {simulationResult.conflicts.map((conflict, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-status-standby mt-1">•</span>
                      <span>{conflict}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Recommendations */}
            {simulationResult.recommendations.length > 0 && (
              <Card className="p-4 bg-primary/5 border-primary/30">
                <h3 className="text-sm font-semibold mb-2">AI Recommendations</h3>
                <ul className="space-y-1">
                  {simulationResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Apply Changes */}
            <div className="flex justify-end">
              <Button
                onClick={onApply}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Apply Scenario
              </Button>
            </div>
          </div>
        )}

        {/* Decision Changes */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Modified Assignments</h3>
          {modifiedDecisions
            .filter((mod, idx) => 
              mod.assignment !== originalDecisions[idx]?.assignment
            )
            .map((decision) => (
              <Card key={decision.trainsetId} className="p-3 bg-card/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Unit {decision.trainsetId}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {originalDecisions.find(d => d.trainsetId === decision.trainsetId)?.assignment}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className="text-xs">
                      {decision.assignment}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </Card>
  );
}