
export interface Report {
    id: string;
    name: string;
    type: string;
    generatedBy: string;
    generatedAt: string;
    status: 'Ready' | 'Processing' | 'Failed';
    size?: string;
    description: string;
    schoolId?: string;
}

export const mockReports: Report[] = [
    { id: 'rpt-001', schoolId: 'sch-001', name: 'Annual Academic Report 2024', type: 'Academic', generatedBy: 'System', generatedAt: '2025-01-15T10:00:00', status: 'Ready', size: '1.2 MB', description: 'Comprehensive analysis of student performance, grade distribution, and attendance records for the academic year 2024.' },
    { id: 'rpt-002', schoolId: 'sch-001', name: 'Student Attendance Summary', type: 'Attendance', generatedBy: 'Admin User', generatedAt: '2025-01-05T09:30:00', status: 'Ready', size: '0.8 MB', description: 'Detailed attendance logs including daily absence rates, late arrivals, and excused leaves for all classes.' },
    { id: 'rpt-003', schoolId: 'sch-001', name: 'Teacher Performance Review', type: 'Performance', generatedBy: 'System', generatedAt: '2024-12-31T16:45:00', status: 'Ready', size: '2.1 MB', description: 'Evaluation metrics for teaching staff based on student feedback, peer reviews, and classroom observation data.' },
    { id: 'rpt-004', schoolId: 'sch-001', name: 'Financial Audit Report', type: 'Financial', generatedBy: 'Admin User', generatedAt: '2024-12-20T11:15:00', status: 'Processing', size: '-', description: 'Audit of school expenditures, tuition fee collections, and budget allocations for Q4 2024.' },
    { id: 'rpt-005', schoolId: 'sch-001', name: 'Infrastructure Audit', type: 'Audit', generatedBy: 'System', generatedAt: '2024-10-10T14:20:00', status: 'Ready', size: '4.5 MB', description: 'Assessment of school facilities, including maintenance requirements for classrooms, labs, and sports grounds.' },
];
