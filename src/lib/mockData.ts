import { Trainset, FleetKPI, Alert, DepotLocation, InductionDecision } from '@/types/fleet';

export const mockTrainsets: Trainset[] = [
  {
    id: 'TS001',
    unitNumber: '801-001',
    status: 'operational',
    location: 'Platform 3',
    depot: 'Central Depot',
    mileage: 125430,
    lastMaintenance: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-02-15'),
    certificates: [
      { id: 'C001', name: 'Safety Inspection', expiryDate: new Date('2024-03-01'), status: 'valid' },
      { id: 'C002', name: 'Brake System', expiryDate: new Date('2024-02-20'), status: 'expiring' }
    ],
    maintenanceJobs: [],
    brandingType: 'Premium Express',
    brandingPriority: 'high',
    exposureHours: 1250,
    fitness: 92,
    assignedService: 'EXPRESS-101',
    stablingPosition: 'A1'
  },
  {
    id: 'TS002',
    unitNumber: '801-002',
    status: 'standby',
    location: 'Depot Bay 2',
    depot: 'Central Depot',
    mileage: 98750,
    lastMaintenance: new Date('2024-01-20'),
    nextMaintenance: new Date('2024-02-25'),
    certificates: [
      { id: 'C003', name: 'Safety Inspection', expiryDate: new Date('2024-03-15'), status: 'valid' },
      { id: 'C004', name: 'Electrical Systems', expiryDate: new Date('2024-04-01'), status: 'valid' }
    ],
    maintenanceJobs: [
      { id: 'MJ001', type: 'Routine Check', status: 'pending', scheduledDate: new Date('2024-02-01') }
    ],
    fitness: 78,
    stablingPosition: 'B3'
  },
  {
    id: 'TS003',
    unitNumber: '801-003',
    status: 'maintenance',
    location: 'Workshop 1',
    depot: 'Central Depot',
    mileage: 145000,
    lastMaintenance: new Date('2024-01-01'),
    nextMaintenance: new Date('2024-01-28'),
    certificates: [
      { id: 'C005', name: 'Safety Inspection', expiryDate: new Date('2024-01-30'), status: 'expiring' }
    ],
    maintenanceJobs: [
      { id: 'MJ002', type: 'Bogie Overhaul', status: 'in-progress', scheduledDate: new Date('2024-01-25'), maxJobId: 'MAX123456' }
    ],
    brandingType: 'City Connect',
    brandingPriority: 'medium',
    exposureHours: 890,
    fitness: 45
  },
  {
    id: 'TS004',
    unitNumber: '802-001',
    status: 'operational',
    location: 'Platform 1',
    depot: 'North Depot',
    mileage: 67890,
    lastMaintenance: new Date('2024-01-10'),
    nextMaintenance: new Date('2024-02-10'),
    certificates: [
      { id: 'C006', name: 'Safety Inspection', expiryDate: new Date('2024-04-01'), status: 'valid' },
      { id: 'C007', name: 'Fire Safety', expiryDate: new Date('2024-03-15'), status: 'valid' }
    ],
    maintenanceJobs: [],
    fitness: 88,
    assignedService: 'LOCAL-202'
  },
  {
    id: 'TS005',
    unitNumber: '802-002',
    status: 'operational',
    location: 'Platform 5',
    depot: 'North Depot',
    mileage: 112000,
    lastMaintenance: new Date('2024-01-05'),
    nextMaintenance: new Date('2024-02-05'),
    certificates: [
      { id: 'C008', name: 'Safety Inspection', expiryDate: new Date('2024-02-01'), status: 'expired' }
    ],
    maintenanceJobs: [],
    brandingType: 'Tourist Special',
    brandingPriority: 'low',
    exposureHours: 450,
    fitness: 65,
    assignedService: 'TOURIST-303'
  }
];

export const mockFleetKPI: FleetKPI = {
  totalTrainsets: 24,
  operational: 18,
  standby: 4,
  underMaintenance: 2,
  fleetAvailability: 91.7,
  punctuality: 94.3,
  mileageCompliance: 87.5
};

export const mockAlerts: Alert[] = [
  {
    id: 'A001',
    severity: 'critical',
    type: 'certificate',
    title: 'Certificate Expired',
    description: 'Unit 802-002 safety inspection certificate has expired',
    timestamp: new Date('2024-01-28T08:00:00'),
    trainsetId: 'TS005',
    actionRequired: 'Schedule immediate safety inspection'
  },
  {
    id: 'A002',
    severity: 'warning',
    type: 'maintenance',
    title: 'Maintenance Due Soon',
    description: 'Unit 801-003 requires bogie overhaul within 3 days',
    timestamp: new Date('2024-01-28T07:30:00'),
    trainsetId: 'TS003',
    actionRequired: 'Confirm workshop availability'
  },
  {
    id: 'A003',
    severity: 'warning',
    type: 'sla',
    title: 'Branding SLA Risk',
    description: 'Tourist Special wrap below minimum exposure hours',
    timestamp: new Date('2024-01-28T06:00:00'),
    trainsetId: 'TS005',
    actionRequired: 'Prioritize for service assignment'
  },
  {
    id: 'A004',
    severity: 'info',
    type: 'conflict',
    title: 'Stabling Conflict',
    description: 'Shunting required for morning service deployment',
    timestamp: new Date('2024-01-28T05:00:00'),
    actionRequired: 'Review stabling arrangement'
  }
];

export const mockDepots: DepotLocation[] = [
  {
    id: 'D001',
    name: 'Central Depot',
    capacity: 12,
    currentOccupancy: 8,
    trainsets: ['TS001', 'TS002', 'TS003'],
    coordinates: { x: 50, y: 50 }
  },
  {
    id: 'D002',
    name: 'North Depot',
    capacity: 8,
    currentOccupancy: 5,
    trainsets: ['TS004', 'TS005'],
    coordinates: { x: 50, y: 20 }
  },
  {
    id: 'D003',
    name: 'South Depot',
    capacity: 10,
    currentOccupancy: 6,
    trainsets: [],
    coordinates: { x: 50, y: 80 }
  }
];

export const mockInductionDecisions: InductionDecision[] = [
  {
    trainsetId: 'TS001',
    assignment: 'service',
    reasoning: [
      'High fitness score (92%)',
      'Valid certificates',
      'Premium branding requires exposure',
      'Optimal mileage distribution'
    ],
    score: 92
  },
  {
    trainsetId: 'TS002',
    assignment: 'standby',
    reasoning: [
      'Moderate fitness score (78%)',
      'Available for emergency deployment',
      'Pending routine maintenance'
    ],
    score: 78,
    alternativeOptions: ['Deploy to LOCAL-204 if needed']
  },
  {
    trainsetId: 'TS003',
    assignment: 'maintenance',
    reasoning: [
      'Low fitness score (45%)',
      'Active bogie overhaul in progress',
      'Certificate expiring soon'
    ],
    score: 45,
    conflicts: ['Cannot meet EXPRESS-102 requirement']
  }
];