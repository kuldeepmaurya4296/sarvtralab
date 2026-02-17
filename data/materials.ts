
export interface Material {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link' | 'zip';
    size?: string;
    courseId: string;
    moduleId?: string; // Optional, to link to specific module
    downloadUrl: string;
    uploadedAt: string;
    description?: string;
}

export const materials: Material[] = [
    {
        id: 'mat-001',
        title: 'Introduction to Robotics - Course Guide',
        type: 'pdf',
        size: '2.4 MB',
        courseId: 'foundation-robotics-3m',
        moduleId: 'fm-1',
        downloadUrl: '#',
        uploadedAt: '2024-01-15',
        description: 'Comprehensive guide covering the basics of robotics, safety protocols, and kit inventory.'
    },
    {
        id: 'mat-002',
        title: 'Block Programming Cheat Sheet',
        type: 'pdf',
        size: '1.1 MB',
        courseId: 'foundation-robotics-3m',
        moduleId: 'fm-3',
        downloadUrl: '#',
        uploadedAt: '2024-02-01',
        description: 'Quick reference guide for common block commands and logic structures.'
    },
    {
        id: 'mat-003',
        title: 'Circuit Diagrams Collection',
        type: 'zip',
        size: '15 MB',
        courseId: 'foundation-robotics-3m',
        moduleId: 'fm-2',
        downloadUrl: '#',
        uploadedAt: '2024-02-10',
        description: 'High-resolution diagrams for all 12 projects in the Basic Electronics module.'
    },
    {
        id: 'mat-004',
        title: 'Python Installation Guide',
        type: 'pdf',
        size: '3.5 MB',
        courseId: 'intermediate-robotics-3m',
        moduleId: 'im-1',
        downloadUrl: '#',
        uploadedAt: '2024-03-05',
        description: 'Step-by-step instructions for setting up Python and VS Code for robotics.'
    },
    {
        id: 'mat-005',
        title: 'Sensor Datasheets Pack',
        type: 'zip',
        size: '45 MB',
        courseId: 'intermediate-robotics-3m',
        moduleId: 'im-2',
        downloadUrl: '#',
        uploadedAt: '2024-03-20',
        description: 'Technical datasheets for Ultrasonic, IR, and Temperature sensors used in the course.'
    },
    {
        id: 'mat-006',
        title: 'ROS Setup Virtual Machine',
        type: 'link',
        courseId: 'advanced-robotics-3m',
        moduleId: 'ad-1',
        downloadUrl: '#',
        uploadedAt: '2024-04-01',
        description: 'Link to download the pre-configured Ubuntu VM with ROS Noetic installed.'
    },
    {
        id: 'mat-007',
        title: 'Computer Vision Dataset',
        type: 'zip',
        size: '1.2 GB',
        courseId: 'advanced-robotics-3m',
        moduleId: 'ad-1',
        downloadUrl: '#',
        uploadedAt: '2024-04-15',
        description: 'Sample image dataset for training your first object detection models.'
    }
];
