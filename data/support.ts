
export interface SupportCategory {
    id: string;
    title: string;
    iconName: string;
    description: string;
}

export interface SupportArticle {
    id: string;
    categoryId: string;
    title: string;
    summary: string;
    lastUpdated: string;
}

export const supportCategories: SupportCategory[] = [
    {
        id: 'cat-courses',
        title: 'Courses & Curriculum',
        iconName: 'BookOpen',
        description: 'Questions about tracks, lessons, quizzes, and certificates.'
    },
    {
        id: 'cat-technical',
        title: 'Technical Support',
        iconName: 'Laptop',
        description: 'Issues with login, video playback, or platform access.'
    },
    {
        id: 'cat-payments',
        title: 'Billing & Payments',
        iconName: 'CreditCard',
        description: 'Invoices, refunds, EMI options, and subscription details.'
    },
    {
        id: 'cat-schools',
        title: 'School Partnerships',
        iconName: 'School',
        description: 'Bulk enrollment, lab setup, and teacher training programs.'
    }
];

export const supportArticles: SupportArticle[] = [
    // Courses
    {
        id: 'art-101',
        categoryId: 'cat-courses',
        title: 'How do I access my course materials?',
        summary: 'Learn where to find your videos, PDFs, and project files in the Student Dashboard.',
        lastUpdated: '2025-10-15'
    },
    {
        id: 'art-102',
        categoryId: 'cat-courses',
        title: 'Can I switch from Foundation to Intermediate track?',
        summary: 'Understanding prerequisites and the process for upgrading your learning track.',
        lastUpdated: '2025-09-20'
    },

    // Technical
    {
        id: 'art-201',
        categoryId: 'cat-technical',
        title: 'Video player is not loading',
        summary: 'Troubleshooting steps for playback issues, including clearing cache and checking connection.',
        lastUpdated: '2025-11-05'
    },
    {
        id: 'art-202',
        categoryId: 'cat-technical',
        title: 'How to reset my password?',
        summary: 'Step-by-step guide to recovering your account access securely.',
        lastUpdated: '2025-08-12'
    },

    // Payments
    {
        id: 'art-301',
        categoryId: 'cat-payments',
        title: 'How to download my invoice?',
        summary: 'Accessing your payment history and downloading tax invoices.',
        lastUpdated: '2025-10-01'
    },

    // Schools
    {
        id: 'art-401',
        categoryId: 'cat-schools',
        title: 'Requirements for setting up a Robotics Lab',
        summary: 'Space, equipment, and network requirements for a Sarvtra Lab setup.',
        lastUpdated: '2025-07-30'
    }
];
