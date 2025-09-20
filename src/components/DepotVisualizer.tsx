import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DepotLocation, Trainset } from '@/types/fleet';
import { 
  Train, 
  MapPin, 
  AlertCircle, 
  Move,
  Maximize2,
  Grid3x3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepotVisualizerProps {
  depots: DepotLocation[];
  trainsets: Trainset[];
  onShunt?: (trainsetId: string, newPosition: string) => void;
}

export function DepotVisualizer({ depots, trainsets, onShunt }: DepotVisualizerProps) {
  const [selectedDepot, setSelectedDepot] = useState<string>(depots[0]?.id);
  const [draggedTrainset, setDraggedTrainset] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);

  const currentDepot = depots.find(d => d.id === selectedDepot);
  const depotTrainsets = trainsets.filter(t => t.depot === currentDepot?.name);

  const getPositionStatus = (position: string) => {
    const trainset = depotTrainsets.find(t => t.stablingPosition === position);
    if (!trainset) return 'empty';
    return trainset.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-status-operational border-status-operational';
      case 'standby':
        return 'bg-status-standby border-status-standby';
      case 'maintenance':
        return 'bg-status-maintenance border-status-maintenance';
      case 'empty':
        return 'bg-muted/20 border-border';
      default:
        return 'bg-status-inactive border-status-inactive';
    }
  };

  const handleDragStart = (trainsetId: string) => {
    setDraggedTrainset(trainsetId);
  };

  const handleDragEnd = () => {
    setDraggedTrainset(null);
    setHoveredPosition(null);
  };

  const handleDrop = (position: string) => {
    if (draggedTrainset && onShunt) {
      onShunt(draggedTrainset, position);
    }
    handleDragEnd();
  };

  // Generate stabling positions grid (simplified visualization)
  const stablingGrid = Array.from({ length: 12 }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 3)); // A, B, C, D
    const col = (i % 3) + 1; // 1, 2, 3
    return `${row}${col}`;
  });

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Depot Visualization</h2>
            <p className="text-sm text-muted-foreground">
              Interactive stabling layout and shunting management
            </p>
          </div>
          <div className="flex items-center gap-2">
            {depots.map((depot) => (
              <Button
                key={depot.id}
                variant={selectedDepot === depot.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepot(depot.id)}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                {depot.name}
              </Button>
            ))}
          </div>
        </div>

        {currentDepot && (
          <>
            {/* Depot Stats */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="text-lg font-bold">{currentDepot.capacity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Occupied</p>
                  <p className="text-lg font-bold">{currentDepot.currentOccupancy}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="text-lg font-bold text-status-operational">
                    {currentDepot.capacity - currentDepot.currentOccupancy}
                  </p>
                </div>
              </div>
              {currentDepot.currentOccupancy > currentDepot.capacity * 0.8 && (
                <Badge variant="outline" className="gap-1 border-status-standby text-status-standby">
                  <AlertCircle className="w-3 h-3" />
                  High Occupancy
                </Badge>
              )}
            </div>

            {/* Stabling Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Stabling Positions</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Move className="w-4 h-4" />
                  Drag to rearrange
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {stablingGrid.map((position) => {
                  const trainset = depotTrainsets.find(t => t.stablingPosition === position);
                  const status = getPositionStatus(position);
                  const isHovered = hoveredPosition === position;

                  return (
                    <div
                      key={position}
                      className={cn(
                        'relative aspect-[2/1] rounded-lg border-2 transition-all',
                        getStatusColor(status),
                        isHovered && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                        'cursor-pointer'
                      )}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setHoveredPosition(position);
                      }}
                      onDragLeave={() => setHoveredPosition(null)}
                      onDrop={() => handleDrop(position)}
                    >
                      <div className="absolute top-1 left-1 text-xs font-bold text-muted-foreground">
                        {position}
                      </div>
                      
                      {trainset && (
                        <div
                          draggable
                          onDragStart={() => handleDragStart(trainset.id)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            'h-full p-2 flex flex-col items-center justify-center gap-1',
                            'hover:opacity-80 cursor-move'
                          )}
                        >
                          <Train className="w-6 h-6" />
                          <span className="text-xs font-medium">{trainset.unitNumber}</span>
                          {trainset.assignedService && (
                            <span className="text-[10px] text-muted-foreground">
                              {trainset.assignedService}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
              <span className="text-xs text-muted-foreground">Status:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-status-operational" />
                  <span className="text-xs">Operational</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-status-standby" />
                  <span className="text-xs">Standby</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-status-maintenance" />
                  <span className="text-xs">Maintenance</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-muted/20 border border-border" />
                  <span className="text-xs">Empty</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}