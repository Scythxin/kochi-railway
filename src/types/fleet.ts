export type TrainsetStatus = 'operational' | 'standby' | 'maintenance' | 'inactive';
export type CertificateStatus = 'valid' | 'expiring' | 'expired';
export type BrandingPriority = 'high' | 'medium' | 'low';

export interface Certificate {
  id: string;
  name: string;
  expiryDate: Date;
  status: CertificateStatus;
}

export interface MaintenanceJob {
  id: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  scheduledDate: Date;
  maxJobId?: string;
}

export interface Trainset {
  id: string;
  unitNumber: string;
  status: TrainsetStatus;
  location: string;
  depot: string;
  mileage: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  certificates: Certificate[];
  maintenanceJobs: MaintenanceJob[];
  brandingType?: string;
  brandingPriority?: BrandingPriority;
  exposureHours?: number;
  fitness: number; // 0-100 fitness score
  assignedService?: string;
  stablingPosition?: string;
}

export interface DepotLocation {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  trainsets: string[]; // Trainset IDs
  coordinates?: { x: number; y: number };
}

export interface FleetKPI {
  totalTrainsets: number;
  operational: number;
  standby: number;
  underMaintenance: number;
  fleetAvailability: number; // percentage
  punctuality: number; // percentage
  mileageCompliance: number; // percentage
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'certificate' | 'maintenance' | 'sla' | 'conflict';
  title: string;
  description: string;
  timestamp: Date;
  trainsetId?: string;
  actionRequired?: string;
}

export interface InductionDecision {
  trainsetId: string;
  assignment: 'service' | 'standby' | 'maintenance';
  reasoning: string[];
  score: number;
  conflicts?: string[];
  alternativeOptions?: string[];
}