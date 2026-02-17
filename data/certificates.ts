import { mockStudents } from '@/data/users';

export interface Certificate {
    id: string;
    studentId: string;
    courseId: string;
    issueDate: string;
    hash?: string;
    downloadUrl?: string;
    status?: 'issued' | 'revoked';
}

export const mockIssuedCertificates: Certificate[] = [
    {
        id: 'CERT-2024-001',
        studentId: mockStudents[0].id,
        courseId: 'intermediate-robotics-3m', // Python course ID from curriculum
        issueDate: '2024-12-20',
        hash: 'a1b2c3d4e5f6',
        downloadUrl: '#'
    },
    {
        id: 'CERT-2025-045',
        studentId: mockStudents[2].id,
        courseId: 'intermediate-robotics-3m',
        issueDate: '2025-01-15',
        hash: 'f6e5d4c3b2a1',
        downloadUrl: '#'
    },
    {
        id: 'CERT-2025-088',
        studentId: mockStudents[3].id,
        courseId: 'foundation-robotics-3m',
        issueDate: '2025-02-10',
        hash: 'c8e1d5f2',
        downloadUrl: '#'
    },
    {
        id: 'CERT-2025-092',
        studentId: mockStudents[4].id,
        courseId: 'foundation-robotics-6m',
        issueDate: '2025-02-14',
        hash: 'd9f2e6g3',
        downloadUrl: '#'
    },
    {
        id: 'CERT-2025-102',
        studentId: mockStudents[0].id,
        courseId: 'foundation-robotics-3m',
        issueDate: '2025-02-18',
        hash: 'e4g5h6i7',
        downloadUrl: '#'
    }
];
