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

// Mock Branding Data
export const mockBrandingData = [
  {
    trainsetId: 'TS001',
    unitNumber: '801-001',
    brandingType: 'Premium Express Wrap',
    requiredHours: 160,
    actualHours: 142,
    slaCompliance: 88.75,
    revenueRisk: 5000,
    priority: 'high' as const
  },
  {
    trainsetId: 'TS002',
    unitNumber: '801-002',
    brandingType: 'Standard Service',
    requiredHours: 120,
    actualHours: 118,
    slaCompliance: 98.3,
    revenueRisk: 500,
    priority: 'medium' as const
  },
  {
    trainsetId: 'TS003',
    unitNumber: '801-003',
    brandingType: 'City Connect',
    requiredHours: 140,
    actualHours: 85,
    slaCompliance: 60.7,
    revenueRisk: 8000,
    priority: 'high' as const
  }
];

// Mock Historical Data
export const mockHistoricalData = [
  { date: 'Jan', availability: 92, punctuality: 95, mileage: 45000, maintenance: 8 },
  { date: 'Feb', availability: 89, punctuality: 93, mileage: 48000, maintenance: 12 },
  { date: 'Mar', availability: 94, punctuality: 96, mileage: 52000, maintenance: 6 },
  { date: 'Apr', availability: 91, punctuality: 94, mileage: 49000, maintenance: 10 },
  { date: 'May', availability: 93, punctuality: 97, mileage: 51000, maintenance: 7 },
  { date: 'Jun', availability: 95, punctuality: 98, mileage: 53000, maintenance: 5 }
];

// Mock Predictions
export const mockPredictions = [
  {
    component: 'Wheelset Assembly',
    currentHealth: 68,
    predictedFailure: 'In 14-21 days',
    confidence: 85,
    recommendation: 'Schedule preventive maintenance'
  },
  {
    component: 'HVAC System',
    currentHealth: 45,
    predictedFailure: 'In 7-10 days',
    confidence: 92,
    recommendation: 'Immediate inspection required'
  },
  {
    component: 'Brake Pads',
    currentHealth: 82,
    predictedFailure: 'In 30-45 days',
    confidence: 78,
    recommendation: 'Monitor closely'
  }
];

// Mock Mileage Data
export const mockMileageData = [
  {
    trainsetId: 'TS001',
    unitNumber: '801-001',
    currentMileage: 125000,
    targetMileage: 120000,
    deviation: 4.2,
    componentWear: { wheels: 45, brakes: 38, hvac: 52, motors: 28 }
  },
  {
    trainsetId: 'TS002',
    unitNumber: '801-002',
    currentMileage: 118000,
    targetMileage: 120000,
    deviation: -1.7,
    componentWear: { wheels: 35, brakes: 42, hvac: 68, motors: 22 }
  },
  {
    trainsetId: 'TS003',
    unitNumber: '801-003',
    currentMileage: 142000,
    targetMileage: 120000,
    deviation: 18.3,
    componentWear: { wheels: 72, brakes: 65, hvac: 78, motors: 55 }
  }
];

// Mock Audit Log
export const mockAuditLog = [
  {
    id: '1',
    timestamp: new Date('2024-01-28T10:30:00'),
    user: 'john.supervisor',
    action: 'Manual Override',
    category: 'override' as const,
    details: 'Changed TS003 assignment from maintenance to standby',
    justification: 'Critical service requirement for morning peak',
    trainsetId: 'TS003'
  },
  {
    id: '2',
    timestamp: new Date('2024-01-28T09:15:00'),
    user: 'system',
    action: 'Automated Induction',
    category: 'automated' as const,
    details: 'Generated daily induction plan for 15 trainsets'
  }
];

// Mock Simulation Result
export const mockSimulationResult = {
  kpiChanges: {
    availability: 2.3,
    punctuality: -0.8,
    mileageBalance: 5.2,
    brandingCompliance: -3.1
  },
  conflicts: [
    'TS003 exceeds maximum mileage limit by 15%',
    'Depot A will have insufficient standby units during peak hours',
    'Branding SLA at risk for Tourist Line Special campaign'
  ],
  recommendations: [
    'Consider rotating TS003 with TS004 to balance mileage',
    'Schedule TS002 for overnight maintenance to maintain availability',
    'Prioritize TS003 for revenue service to meet branding requirements'
  ]
};