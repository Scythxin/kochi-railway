import { useState } from 'react';
import { KPICard } from '@/components/KPICard';
import { AlertCard } from '@/components/AlertCard';
import { TrainsetCard } from '@/components/TrainsetCard';
import { InductionPlanner } from '@/components/InductionPlanner';
import { DepotVisualizer } from '@/components/DepotVisualizer';
import { BrandingInsights } from '@/components/BrandingInsights';
import { HistoricalInsights } from '@/components/HistoricalInsights';
import { MaintenanceTracker } from '@/components/MaintenanceTracker';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { AuditLog } from '@/components/AuditLog';
import { MileageBalancer } from '@/components/MileageBalancer';
import { 
  mockFleetKPI, 
  mockAlerts, 
  mockTrainsets, 
  mockInductionDecisions,
  mockDepots,
  mockBrandingData,
  mockHistoricalData,
  mockPredictions,
  mockMileageData,
  mockAuditLog,
  mockSimulationResult
} from '@/lib/mockData';
import { 
  Train, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Bell,
  Filter,
  Search,
  Settings,
  Menu,
  GitCompare,
  TrendingUp,
  Shield,
  Award,
  Download,
  History,
  Gauge
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [selectedTrainset, setSelectedTrainset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepot, setFilterDepot] = useState<string>('all');
  const [simulationDecisions, setSimulationDecisions] = useState(mockInductionDecisions);

  const criticalAlerts = mockAlerts.filter(a => a.severity === 'critical');
  const warningAlerts = mockAlerts.filter(a => a.severity === 'warning');

  // Get all certificates and maintenance jobs from trainsets
  const allCertificates = mockTrainsets.flatMap(t => t.certificates);
  const allMaintenanceJobs = mockTrainsets.flatMap(t => t.maintenanceJobs);

  // Filter trainsets based on search and filters
  const filteredTrainsets = mockTrainsets.filter(t => {
    const matchesSearch = searchQuery === '' || 
      t.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesDepot = filterDepot === 'all' || t.depot === filterDepot;
    
    return matchesSearch && matchesStatus && matchesDepot;
  });

  const handleExport = () => {
    console.log('Exporting data...');
    // In a real app, this would generate PDF/Excel
  };

  const handleSimulate = () => {
    console.log('Running simulation...');
    // Simulation logic would go here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Train className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Rail Fleet Operations</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainsets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {criticalAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-status-maintenance animate-pulse" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Fleet Availability"
            value={mockFleetKPI.fleetAvailability}
            unit="%"
            change={2.3}
            trend="up"
            icon={<CheckCircle className="h-5 w-5 text-status-operational" />}
            variant="success"
          />
          <KPICard
            title="Operational Units"
            value={`${mockFleetKPI.operational}/${mockFleetKPI.totalTrainsets}`}
            change={-1.2}
            trend="down"
            icon={<Train className="h-5 w-5 text-primary" />}
          />
          <KPICard
            title="Punctuality"
            value={mockFleetKPI.punctuality}
            unit="%"
            change={0.8}
            trend="up"
            icon={<Activity className="h-5 w-5 text-accent" />}
            variant="success"
          />
          <KPICard
            title="Active Alerts"
            value={mockAlerts.length}
            change={15}
            trend="up"
            icon={<AlertTriangle className="h-5 w-5 text-status-standby" />}
            variant={criticalAlerts.length > 0 ? 'danger' : 'warning'}
          />
        </div>

        {/* Alerts Section */}
        {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Active Alerts
                <Badge variant="destructive">{mockAlerts.length}</Badge>
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {[...criticalAlerts, ...warningAlerts].slice(0, 4).map((alert) => (
                <AlertCard 
                  key={alert.id} 
                  alert={alert}
                  onAction={() => console.log('Action:', alert.id)}
                  onDismiss={() => console.log('Dismiss:', alert.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex-wrap h-auto">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="induction" className="gap-2">
              <Activity className="h-4 w-4" />
              Induction
            </TabsTrigger>
            <TabsTrigger value="simulation" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <Shield className="h-4 w-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="mileage" className="gap-2">
              <Gauge className="h-4 w-4" />
              Mileage
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Award className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="depot" className="gap-2">
              <Train className="h-4 w-4" />
              Depot
            </TabsTrigger>
            <TabsTrigger value="fleet" className="gap-2">
              <Filter className="h-4 w-4" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="h-4 w-4" />
              Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InductionPlanner
                decisions={mockInductionDecisions}
                trainsets={mockTrainsets}
                onSimulate={handleSimulate}
                onRefresh={() => console.log('Refresh')}
                onOverride={(id) => console.log('Override:', id)}
              />
              <MileageBalancer mileageData={mockMileageData} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MaintenanceTracker
                certificates={allCertificates}
                maintenanceJobs={allMaintenanceJobs}
                onJobUpdate={(id) => console.log('Update job:', id)}
                onCertificateRenew={(id) => console.log('Renew cert:', id)}
              />
              <BrandingInsights
                brandingData={mockBrandingData}
                onPriorityChange={(id, priority) => console.log('Priority change:', id, priority)}
              />
            </div>
          </TabsContent>

          <TabsContent value="induction">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Fleet Induction Planner</h2>
                <div className="flex items-center gap-2">
                  <Select value={filterDepot} onValueChange={setFilterDepot}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Depot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Depots</SelectItem>
                      <SelectItem value="Depot A">Depot A</SelectItem>
                      <SelectItem value="Depot B">Depot B</SelectItem>
                      <SelectItem value="Depot C">Depot C</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="standby">Standby</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <InductionPlanner
                decisions={mockInductionDecisions}
                trainsets={filteredTrainsets}
                onSimulate={handleSimulate}
                onRefresh={() => console.log('Refresh')}
                onOverride={(id) => console.log('Override:', id)}
              />
            </div>
          </TabsContent>

          <TabsContent value="simulation">
            <WhatIfSimulator
              originalDecisions={mockInductionDecisions}
              modifiedDecisions={simulationDecisions}
              simulationResult={mockSimulationResult}
              onSimulate={handleSimulate}
              onReset={() => setSimulationDecisions(mockInductionDecisions)}
              onApply={() => console.log('Apply simulation')}
              onDecisionChange={(id, assignment) => {
                setSimulationDecisions(prev => 
                  prev.map(d => d.trainsetId === id ? {...d, assignment: assignment as any} : d)
                );
              }}
            />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTracker
              certificates={allCertificates}
              maintenanceJobs={allMaintenanceJobs}
              onJobUpdate={(id) => console.log('Update job:', id)}
              onCertificateRenew={(id) => console.log('Renew cert:', id)}
            />
          </TabsContent>

          <TabsContent value="mileage">
            <MileageBalancer mileageData={mockMileageData} />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingInsights
              brandingData={mockBrandingData}
              onPriorityChange={(id, priority) => console.log('Priority change:', id, priority)}
            />
          </TabsContent>

          <TabsContent value="depot">
            <DepotVisualizer
              depots={mockDepots}
              trainsets={mockTrainsets}
              onShunt={(trainsetId, position) => console.log('Shunt:', trainsetId, position)}
            />
          </TabsContent>

          <TabsContent value="fleet">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Fleet Status</h2>
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="standby">Standby</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDepot} onValueChange={setFilterDepot}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Depot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Depots</SelectItem>
                      <SelectItem value="Depot A">Depot A</SelectItem>
                      <SelectItem value="Depot B">Depot B</SelectItem>
                      <SelectItem value="Depot C">Depot C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTrainsets.map((trainset) => (
                    <TrainsetCard
                      key={trainset.id}
                      trainset={trainset}
                      selected={selectedTrainset === trainset.id}
                      onClick={() => setSelectedTrainset(trainset.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <HistoricalInsights
              historicalData={mockHistoricalData}
              predictions={mockPredictions}
              accuracyScore={87.5}
              onExport={handleExport}
            />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog
              entries={mockAuditLog}
              onExport={handleExport}
              onFilter={() => console.log('Filter audit log')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;