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
import { ThemeToggle } from '@/components/ThemeToggle';
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
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h1 className="text-base sm:text-lg md:text-xl font-bold">Rail Fleet Operations</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainsets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 lg:w-64"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {criticalAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-status-maintenance animate-pulse" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex h-8 w-8 sm:h-9 sm:w-9">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <ThemeToggle />
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                className="gap-1 sm:gap-2 hidden sm:inline-flex"
              >
                <Download className="h-4 w-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile search bar */}
          <div className="relative mt-3 md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainsets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <KPICard
            title="Fleet Availability"
            value={mockFleetKPI.fleetAvailability}
            unit="%"
            change={2.3}
            trend="up"
            icon={<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-status-operational" />}
            variant="success"
          />
          <KPICard
            title="Operational Units"
            value={`${mockFleetKPI.operational}/${mockFleetKPI.totalTrainsets}`}
            change={-1.2}
            trend="down"
            icon={<Train className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
          />
          <KPICard
            title="Punctuality"
            value={mockFleetKPI.punctuality}
            unit="%"
            change={0.8}
            trend="up"
            icon={<Activity className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />}
            variant="success"
          />
          <KPICard
            title="Active Alerts"
            value={mockAlerts.length}
            change={15}
            trend="up"
            icon={<AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-status-standby" />}
            variant={criticalAlerts.length > 0 ? 'danger' : 'warning'}
          />
        </div>

        {/* Alerts Section */}
        {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-1 sm:gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Active Alerts</span>
                <span className="sm:hidden">Alerts</span>
                <Badge variant="destructive" className="scale-90 sm:scale-100">{mockAlerts.length}</Badge>
              </h2>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
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
          <ScrollArea className="w-full">
            <TabsList className="mb-3 sm:mb-4 flex-wrap h-auto justify-start inline-flex w-max">
              <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">View</span>
              </TabsTrigger>
              <TabsTrigger value="induction" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Induction</span>
                <span className="sm:hidden">Induct</span>
              </TabsTrigger>
              <TabsTrigger value="simulation" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <GitCompare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Simulation</span>
                <span className="sm:hidden">Sim</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Maintenance</span>
                <span className="sm:hidden">Maint</span>
              </TabsTrigger>
              <TabsTrigger value="mileage" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Mileage</span>
                <span className="sm:hidden">Miles</span>
              </TabsTrigger>
              <TabsTrigger value="branding" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Branding</span>
                <span className="sm:hidden">Brand</span>
              </TabsTrigger>
              <TabsTrigger value="depot" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Train className="h-3 w-3 sm:h-4 sm:w-4" />
                Depot
              </TabsTrigger>
              <TabsTrigger value="fleet" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                Fleet
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Insights</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <History className="h-3 w-3 sm:h-4 sm:w-4" />
                Audit
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <InductionPlanner
                decisions={mockInductionDecisions}
                trainsets={mockTrainsets}
                onSimulate={handleSimulate}
                onRefresh={() => console.log('Refresh')}
                onOverride={(id) => console.log('Override:', id)}
              />
              <MileageBalancer mileageData={mockMileageData} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Fleet Induction Planner</h2>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Select value={filterDepot} onValueChange={setFilterDepot}>
                    <SelectTrigger className="w-full sm:w-32">
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
                    <SelectTrigger className="w-full sm:w-32">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-bold">Fleet Status</h2>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
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
                    <SelectTrigger className="w-full sm:w-32">
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
              
              <ScrollArea className="h-[60vh] sm:h-[calc(100vh-400px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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