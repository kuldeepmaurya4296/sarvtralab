export type UserRole = 'student' | 'school' | 'govt' | 'superadmin' | 'teacher' | 'helpsupport';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  schoolId: string;
  schoolName: string;
  grade: string;
  enrolledCourses: string[];
  completedCourses: string[];
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'active' | 'inactive';
}

export interface School extends User {
  role: 'school';
  schoolCode: string;
  principalName: string;
  schoolType: 'government' | 'private' | 'aided';
  board: 'CBSE' | 'ICSE' | 'State Board';
  totalStudents: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  websiteUrl?: string;
  subscriptionPlan: 'basic' | 'standard' | 'premium';
  subscriptionExpiry: string;
  assignedCourses: string[];
}

export interface GovtOrg extends User {
  role: 'govt';
  organizationType: 'education_dept' | 'skill_ministry' | 'niti_aayog' | 'other';
  organizationName: string;
  designation: string;
  department: string;
  jurisdiction: 'national' | 'state' | 'district';
  state?: string;
  district?: string;
  assignedSchools: string[];
  status: 'active' | 'inactive';
}

export interface SuperAdmin extends User {
  role: 'superadmin';
  permissions: string[];
  lastLogin: string;
}

export interface Teacher extends User {
  role: 'teacher';
  specialization: string;
  qualifications: string;
  assignedCourses: string[];
  assignedSchools: string[];
  experience: number;
  phone: string;
  status: 'active' | 'inactive';
}

export interface HelpSupport extends User {
  role: 'helpsupport';
  department: 'technical' | 'academic' | 'general';
  assignedStudents: string[];
  ticketsResolved: number;
  ticketsPending: number;
  phone: string;
  status: 'available' | 'busy' | 'offline';
}

export const mockStudents: Student[] = [
  {
    id: 'std-001',
    email: 'arjun.patel@student.robolearn.com',
    password: 'student123',
    role: 'student',
    name: 'Arjun Patel',
    schoolId: 'sch-001',
    schoolName: 'Delhi Public School, Noida',
    grade: 'Class 6',
    enrolledCourses: ['foundation-robotics-3m'],
    completedCourses: [],
    parentName: 'Rajesh Patel',
    parentPhone: '+91 98765 43210',
    parentEmail: 'rajesh.patel@email.com',
    dateOfBirth: '2013-05-15',
    address: '42, Sector 15',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    status: 'active',
    createdAt: '2025-01-15'
  },
  {
    id: 'std-002',
    email: 'priya.sharma@student.robolearn.com',
    password: 'student123',
    role: 'student',
    name: 'Priya Sharma',
    schoolId: 'sch-001',
    schoolName: 'Delhi Public School, Noida',
    grade: 'Class 8',
    enrolledCourses: ['intermediate-robotics-3m'],
    completedCourses: ['foundation-robotics-3m'],
    parentName: 'Amit Sharma',
    parentPhone: '+91 98765 43211',
    parentEmail: 'amit.sharma@email.com',
    dateOfBirth: '2011-08-22',
    address: '15, Sector 22',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    status: 'active',
    createdAt: '2024-08-10'
  },
  {
    id: 'std-003',
    email: 'rahul.verma@student.robolearn.com',
    password: 'student123',
    role: 'student',
    name: 'Rahul Verma',
    schoolId: 'sch-002',
    schoolName: 'Ryan International School',
    grade: 'Class 11',
    enrolledCourses: ['advanced-robotics-9m'],
    completedCourses: ['intermediate-robotics-6m'],
    parentName: 'Suresh Verma',
    parentPhone: '+91 98765 43212',
    parentEmail: 'suresh.verma@email.com',
    dateOfBirth: '2009-03-10',
    address: '78, MG Road',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    status: 'active',
    createdAt: '2024-06-01'
  },
  {
    id: 'std-004',
    email: 'kavita.singh@student.robolearn.com',
    password: 'student123',
    role: 'student',
    name: 'Kavita Singh',
    schoolId: 'sch-003',
    schoolName: 'Kendriya Vidyalaya, Delhi',
    grade: 'Class 9',
    enrolledCourses: ['advanced-robotics-3m'],
    completedCourses: [],
    parentName: 'Manoj Singh',
    parentPhone: '+91 98765 43213',
    parentEmail: 'manoj.singh@email.com',
    dateOfBirth: '2010-12-12',
    address: 'Sector 5',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110005',
    status: 'active',
    createdAt: '2024-07-20'
  },
  {
    id: 'std-005',
    email: 'rohan.das@student.robolearn.com',
    password: 'student123',
    role: 'student',
    name: 'Rohan Das',
    schoolId: 'sch-001',
    schoolName: 'Delhi Public School, Noida',
    grade: 'Class 5',
    enrolledCourses: ['foundation-robotics-6m'],
    completedCourses: [],
    parentName: 'Sunil Das',
    parentPhone: '+91 98765 43214',
    parentEmail: 'sunil.das@email.com',
    dateOfBirth: '2014-02-18',
    address: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
    status: 'active',
    createdAt: '2025-01-05'
  }
];

export const mockSchools: School[] = [
  {
    id: 'sch-001',
    email: 'admin@dpsnoida.edu.in',
    password: 'school123',
    role: 'school',
    name: 'Delhi Public School, Noida',
    schoolCode: 'DPS-NOI-001',
    principalName: 'Dr. Meera Gupta',
    schoolType: 'private',
    board: 'CBSE',
    totalStudents: 2500,
    address: 'Sector 30',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201303',
    phone: '+91 120 4567890',
    websiteUrl: 'https://dpsnoida.edu.in',
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2026-03-31',
    assignedCourses: ['foundation-robotics-3m', 'foundation-robotics-6m', 'intermediate-robotics-3m'],
    createdAt: '2024-01-01'
  },
  {
    id: 'sch-002',
    email: 'admin@ryaninternational.edu.in',
    password: 'school123',
    role: 'school',
    name: 'Ryan International School',
    schoolCode: 'RIS-GUR-001',
    principalName: 'Mr. Vikram Singh',
    schoolType: 'private',
    board: 'CBSE',
    totalStudents: 1800,
    address: 'DLF Phase 3',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    phone: '+91 124 4567890',
    websiteUrl: 'https://ryaninternational.edu.in',
    subscriptionPlan: 'standard',
    subscriptionExpiry: '2025-12-31',
    assignedCourses: ['foundation-robotics-3m', 'intermediate-robotics-6m', 'advanced-robotics-9m'],
    createdAt: '2024-02-15'
  },
  {
    id: 'sch-003',
    email: 'admin@kvdelhi.edu.in',
    password: 'school123',
    role: 'school',
    name: 'Kendriya Vidyalaya, Delhi',
    schoolCode: 'KV-DEL-001',
    principalName: 'Mrs. Sunita Rao',
    schoolType: 'government',
    board: 'CBSE',
    totalStudents: 1200,
    address: 'R.K. Puram',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110022',
    phone: '+91 11 4567890',
    subscriptionPlan: 'basic',
    subscriptionExpiry: '2025-09-30',
    assignedCourses: ['foundation-robotics-3m'],
    createdAt: '2024-04-01'
  }
];

export const mockGovtOrgs: GovtOrg[] = [
  {
    id: 'gov-001',
    email: 'director@education.gov.in',
    password: 'govt123',
    role: 'govt',
    name: 'Shri Ramesh Chandra',
    organizationType: 'education_dept',
    organizationName: 'Ministry of Education',
    designation: 'Joint Secretary',
    department: 'School Education & Literacy',
    jurisdiction: 'national',
    assignedSchools: ['sch-001', 'sch-002', 'sch-003'],
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: 'gov-002',
    email: 'director@upskill.gov.in',
    password: 'govt123',
    role: 'govt',
    name: 'Dr. Anita Kumari',
    organizationType: 'skill_ministry',
    organizationName: 'State Education Department',
    designation: 'Director',
    department: 'STEM Education',
    jurisdiction: 'state',
    state: 'Uttar Pradesh',
    assignedSchools: ['sch-001'],
    status: 'active',
    createdAt: '2024-03-01'
  }
];

export const mockSuperAdmin: SuperAdmin = {
  id: 'admin-001',
  email: 'superadmin@robolearn.com',
  password: 'admin123',
  role: 'superadmin',
  name: 'System Administrator',
  permissions: ['all'],
  lastLogin: '2025-02-03T10:30:00',
  createdAt: '2024-01-01'
};

export const mockTeachers: Teacher[] = [
  {
    id: 'tch-001',
    email: 'vikram.sharma@robolearn.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Vikram Sharma',
    specialization: 'Robotics & Electronics',
    qualifications: 'M.Tech in Robotics, IIT Delhi',
    assignedCourses: ['foundation-robotics-3m', 'foundation-robotics-6m'],
    assignedSchools: ['sch-001', 'sch-002'],
    experience: 8,
    phone: '+91 98765 11111',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 'tch-002',
    email: 'priya.menon@robolearn.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Priya Menon',
    specialization: 'Programming & AI',
    qualifications: 'M.Sc Computer Science, BITS Pilani',
    assignedCourses: ['intermediate-robotics-3m', 'intermediate-robotics-6m'],
    assignedSchools: ['sch-001', 'sch-003'],
    experience: 5,
    phone: '+91 98765 22222',
    status: 'active',
    createdAt: '2024-02-01'
  },
  {
    id: 'tch-003',
    email: 'amit.kumar@robolearn.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Amit Kumar',
    specialization: 'Advanced Robotics & IoT',
    qualifications: 'PhD in Mechatronics, IISc Bangalore',
    assignedCourses: ['advanced-robotics-6m', 'advanced-robotics-9m'],
    assignedSchools: ['sch-002'],
    experience: 12,
    phone: '+91 98765 33333',
    status: 'active',
    createdAt: '2024-01-01'
  }
];

export const mockHelpSupport: HelpSupport[] = [
  {
    id: 'help-001',
    email: 'support.rahul@robolearn.com',
    password: 'support123',
    role: 'helpsupport',
    name: 'Rahul Gupta',
    department: 'technical',
    assignedStudents: ['std-001', 'std-002'],
    ticketsResolved: 156,
    ticketsPending: 3,
    phone: '+91 98765 44444',
    status: 'available',
    createdAt: '2024-03-01'
  },
  {
    id: 'help-002',
    email: 'support.neha@robolearn.com',
    password: 'support123',
    role: 'helpsupport',
    name: 'Neha Singh',
    department: 'academic',
    assignedStudents: ['std-003'],
    ticketsResolved: 203,
    ticketsPending: 5,
    phone: '+91 98765 55555',
    status: 'available',
    createdAt: '2024-02-15'
  },
  {
    id: 'help-003',
    email: 'support.arun@robolearn.com',
    password: 'support123',
    role: 'helpsupport',
    name: 'Arun Krishnan',
    department: 'general',
    assignedStudents: [],
    ticketsResolved: 89,
    ticketsPending: 2,
    phone: '+91 98765 66666',
    status: 'busy',
    createdAt: '2024-04-01'
  }
];

export const mockSupportTickets = [
  {
    id: 'ticket-001',
    studentId: 'std-001',
    studentName: 'Arjun Patel',
    subject: 'Unable to access video lessons',
    description: 'Getting an error when trying to play Module 3 videos',
    status: 'open',
    priority: 'high',
    assignedTo: 'help-001',
    createdAt: '2025-02-03',
    updatedAt: '2025-02-03'
  },
  {
    id: 'ticket-002',
    studentId: 'std-002',
    studentName: 'Priya Sharma',
    subject: 'Quiz score not updating',
    description: 'Completed the quiz but score shows 0%',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'help-002',
    createdAt: '2025-02-02',
    updatedAt: '2025-02-03'
  },
  {
    id: 'ticket-003',
    studentId: 'std-001',
    studentName: 'Arjun Patel',
    subject: 'Certificate download issue',
    description: 'Cannot download course completion certificate',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'help-001',
    createdAt: '2025-01-28',
    updatedAt: '2025-01-29'
  }
];

export const loginCredentials = [
  { role: 'student', email: 'arjun.patel@student.robolearn.com', password: 'student123' },
  { role: 'school', email: 'admin@dpsnoida.edu.in', password: 'school123' },
  { role: 'govt', email: 'director@education.gov.in', password: 'govt123' },
  { role: 'superadmin', email: 'superadmin@robolearn.com', password: 'admin123' },
  { role: 'teacher', email: 'vikram.sharma@robolearn.com', password: 'teacher123' },
  { role: 'helpsupport', email: 'support.rahul@robolearn.com', password: 'support123' }
];
