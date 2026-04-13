export type IssueStatus = 'reported' | 'in_progress' | 'resolved';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type IssueCategory = 'power' | 'water' | 'furniture' | 'network' | 'hvac' | 'safety' | 'other';

export interface Issue {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  building: string;
  room?: string;
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  images?: string[];
}

export interface Analytics {
  total: number;
  reported: number;
  inProgress: number;
  resolved: number;
  byCategory: Record<IssueCategory, number>;
  avgResolutionTime: string;
}


export const categoryLabels: Record<IssueCategory, string> = {
  power: 'Power Failure',
  water: 'Water Leakage',
  furniture: 'Broken Furniture',
  network: 'Network Problems',
  hvac: 'HVAC Issues',
  safety: 'Safety Concerns',
  other: 'Other'
};

export const statusLabels: Record<IssueStatus, string> = {
  reported: 'Reported',
  in_progress: 'In Progress',
  resolved: 'Resolved'
};

export const priorityLabels: Record<IssuePriority, string> = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Urgent: 'Urgent'
};

export const buildings = [
  'Academic Block A',
  'Academic Block B',
  'Library',
  'Hostel Block 1',
  'Hostel Block 2',
  'Hostel Block 3',
  'Cafeteria',
  'Sports Complex',
  'Admin Building',
  'Lab Complex'
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'No power in Room 201',
    description: 'Complete power outage in classroom 201. No lights or AC working. Class scheduled in 30 minutes.',
    category: 'power',
    location: 'Academic Block A, Floor 2',
    building: 'Academic Block A',
    room: '201',
    status: 'in_progress',
    priority: 'Urgent',
    reportedBy: 'Rahul Sharma',
    reportedAt: '2026-04-12T08:30:00Z',
    assignedTo: 'Electrical Team'
  },
  {
    id: '2',
    title: 'Water leaking from ceiling',
    description: 'Continuous water dripping from ceiling in the corridor. Floor is wet and slippery.',
    category: 'water',
    location: 'Hostel Block 2, Floor 3',
    building: 'Hostel Block 2',
    status: 'reported',
    priority: 'High',
    reportedBy: 'Priya Singh',
    reportedAt: '2026-04-12T07:15:00Z'
  },
  {
    id: '3',
    title: 'Broken chair in library',
    description: 'Study table chair has a broken leg. Unsafe to sit.',
    category: 'furniture',
    location: 'Library, Reading Section',
    building: 'Library',
    status: 'resolved',
    priority: 'Low',
    reportedBy: 'Amit Patel',
    reportedAt: '2026-04-11T14:20:00Z',
    assignedTo: 'Maintenance Staff',
    resolvedAt: '2026-04-12T10:00:00Z'
  },
  {
    id: '4',
    title: 'WiFi not working',
    description: 'Unable to connect to campus WiFi network. Multiple students affected.',
    category: 'network',
    location: 'Hostel Block 1, Common Room',
    building: 'Hostel Block 1',
    status: 'in_progress',
    priority: 'Medium',
    reportedBy: 'Sneha Reddy',
    reportedAt: '2026-04-12T06:45:00Z',
    assignedTo: 'IT Department'
  },
  {
    id: '5',
    title: 'AC not cooling',
    description: 'Air conditioning unit running but not cooling the room. Temperature is uncomfortable.',
    category: 'hvac',
    location: 'Lab Complex, Computer Lab 1',
    building: 'Lab Complex',
    room: 'CL-1',
    status: 'reported',
    priority: 'Medium',
    reportedBy: 'Vikram Kumar',
    reportedAt: '2026-04-12T09:00:00Z'
  },
  {
    id: '6',
    title: 'Broken window glass',
    description: 'Window glass cracked, potential safety hazard.',
    category: 'safety',
    location: 'Academic Block B, Classroom 105',
    building: 'Academic Block B',
    room: '105',
    status: 'reported',
    priority: 'High',
    reportedBy: 'Anjali Desai',
    reportedAt: '2026-04-11T16:30:00Z'
  },
  {
    id: '7',
    title: 'Projector not working',
    description: 'Classroom projector not turning on. Needed for lecture.',
    category: 'other',
    location: 'Academic Block A, Room 305',
    building: 'Academic Block A',
    room: '305',
    status: 'resolved',
    priority: 'Medium',
    reportedBy: 'Prof. Mehta',
    reportedAt: '2026-04-11T10:00:00Z',
    assignedTo: 'IT Department',
    resolvedAt: '2026-04-11T15:30:00Z'
  },
  {
    id: '8',
    title: 'Washroom tap leaking',
    description: 'Continuous water flow from tap, wastage of water.',
    category: 'water',
    location: 'Cafeteria, Ground Floor Washroom',
    building: 'Cafeteria',
    status: 'in_progress',
    priority: 'Low',
    reportedBy: 'Student Council',
    reportedAt: '2026-04-12T07:00:00Z',
    assignedTo: 'Plumbing Team'
  }
];

// Helper function to get issues by status
export const getIssuesByStatus = (status: IssueStatus) =>
  mockIssues.filter(issue => issue.status === status);

// Helper function to get issues by category
export const getIssuesByCategory = (category: IssueCategory) =>
  mockIssues.filter(issue => issue.category === category);

// Analytics data
export const getAnalytics = () => {
  const total = mockIssues.length;
  const reported = mockIssues.filter(i => i.status === 'reported').length;
  const inProgress = mockIssues.filter(i => i.status === 'in_progress').length;
  const resolved = mockIssues.filter(i => i.status === 'resolved').length;

  const byCategory = Object.keys(categoryLabels).reduce((acc, cat) => {
    acc[cat as IssueCategory] = mockIssues.filter(i => i.category === cat).length;
    return acc;
  }, {} as Record<IssueCategory, number>);

  return {
    total,
    reported,
    inProgress,
    resolved,
    byCategory,
    avgResolutionTime: '4.2 hours'
  };
};
