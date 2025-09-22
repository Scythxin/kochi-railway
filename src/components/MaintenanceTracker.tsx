import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileCheck,
  XCircle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Certificate, MaintenanceJob } from '@/types/fleet';

interface MaintenanceTrackerProps {
  certificates: Certificate[];
  maintenanceJobs: MaintenanceJob[];
  onJobUpdate?: (jobId: string) => void;
  onCertificateRenew?: (certId: string) => void;
}

export function MaintenanceTracker({
  certificates,
  maintenanceJobs,
  onJobUpdate,
  onCertificateRenew
}: MaintenanceTrackerProps) {
  const [activeTab, setActiveTab] = useState('certificates');

  const getCertificateStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-status-operational/10 text-status-operational border-status-operational/30';
      case 'expiring':
        return 'bg-status-standby/10 text-status-standby border-status-standby/30';
      case 'expired':
        return 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-status-operational" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-status-standby" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const validCerts = certificates.filter(c => c.status === 'valid');
  const expiringCerts = certificates.filter(c => c.status === 'expiring');
  const expiredCerts = certificates.filter(c => c.status === 'expired');

  const completedJobs = maintenanceJobs.filter(j => j.status === 'completed');
  const inProgressJobs = maintenanceJobs.filter(j => j.status === 'in-progress');
  const pendingJobs = maintenanceJobs.filter(j => j.status === 'pending');

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Maintenance & Fitness Tracking</h2>
            <p className="text-sm text-muted-foreground">
              Certificates, compliance, and job-card status
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Maximo
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-status-operational" />
              <div>
                <p className="text-xs text-muted-foreground">Valid Certificates</p>
                <p className="text-lg font-bold">{validCerts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-status-standby" />
              <div>
                <p className="text-xs text-muted-foreground">Expiring Soon</p>
                <p className="text-lg font-bold text-status-standby">{expiringCerts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
                <p className="text-lg font-bold">{inProgressJobs.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Pending Jobs</p>
                <p className="text-lg font-bold">{pendingJobs.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="certificates" className="gap-2">
              <Shield className="h-4 w-4" />
              Certificates
              {expiredCerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1">
                  {expiredCerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobcards" className="gap-2">
              <Wrench className="h-4 w-4" />
              Job Cards
              <Badge variant="outline" className="ml-1 h-5 px-1">
                {maintenanceJobs.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-3 mt-4">
            {certificates.map((cert) => {
              const daysUntilExpiry = Math.floor(
                (new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <Card key={cert.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{cert.name}</h4>
                          <Badge 
                            variant="outline"
                            className={cn('text-xs', getCertificateStatusColor(cert.status))}
                          >
                            {cert.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </span>
                          {cert.status !== 'expired' && (
                            <span className={cn(
                              'text-sm font-medium',
                              daysUntilExpiry < 30 ? 'text-status-standby' : 'text-muted-foreground'
                            )}>
                              {daysUntilExpiry} days remaining
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {(cert.status === 'expiring' || cert.status === 'expired') && (
                      <Button
                        size="sm"
                        variant={cert.status === 'expired' ? 'destructive' : 'outline'}
                        onClick={() => onCertificateRenew?.(cert.id)}
                        className="gap-1"
                      >
                        Renew
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          {/* Job Cards Tab */}
          <TabsContent value="jobcards" className="space-y-3 mt-4">
            {maintenanceJobs.map((job) => {
              const isOverdue = new Date(job.scheduledDate) < new Date() && job.status === 'pending';
              
              return (
                <Card key={job.id} className={cn(
                  "p-4",
                  isOverdue && "border-status-standby/50"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getJobStatusIcon(job.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{job.type}</h4>
                          {job.maxJobId && (
                            <Badge variant="outline" className="text-xs">
                              {job.maxJobId}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(job.scheduledDate).toLocaleDateString()}
                          </span>
                          {isOverdue && (
                            <span className="text-sm font-medium text-status-standby">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {job.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onJobUpdate?.(job.id)}
                        >
                          Start Job
                        </Button>
                      )}
                      {job.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onJobUpdate?.(job.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}