
import { BookOpen, Award, TrendingUp, Shield } from 'lucide-react';

export interface Plan {
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    popular: boolean;
}

export interface Benefit {
    title: string;
    description: string;
    iconName: string;
}

export const schoolPlans: Plan[] = [
    {
        name: 'Basic',
        description: 'For small schools getting started',
        price: '₹49,999',
        period: '/year',
        features: [
            'Up to 50 students',
            '3 Course licenses',
            'Basic analytics dashboard',
            'Email support',
            'Teacher training (2 sessions)',
            'Standard robotics kits'
        ],
        popular: false
    },
    {
        name: 'Premium',
        description: 'Most popular for growing schools',
        price: '₹1,49,999',
        period: '/year',
        features: [
            'Up to 200 students',
            'All Course licenses',
            'Advanced analytics & reports',
            'Priority phone support',
            'Teacher training (6 sessions)',
            'Premium robotics kits',
            'Competition preparation',
            'Parent portal access'
        ],
        popular: true
    },
    {
        name: 'Enterprise',
        description: 'For large schools & chains',
        price: 'Custom',
        period: '',
        features: [
            'Unlimited students',
            'All Course licenses',
            'Custom curriculum integration',
            'Dedicated account manager',
            'Unlimited teacher training',
            'Custom robotics solutions',
            'White-label options',
            'API access'
        ],
        popular: false
    }
];

export const schoolBenefits: Benefit[] = [
    {
        iconName: 'BookOpen',
        title: 'CBSE Aligned Curriculum',
        description: 'Fully aligned with NCF 2023, NEP 2020, and CBSE Skill Education Framework'
    },
    {
        iconName: 'Award',
        title: 'Certified Training',
        description: 'Comprehensive teacher training with certification and ongoing support'
    },
    {
        iconName: 'TrendingUp',
        title: 'Analytics Dashboard',
        description: 'Real-time insights into student progress and learning outcomes'
    },
    {
        iconName: 'Shield',
        title: 'Complete Kit Solution',
        description: 'Industry-standard robotics kits with maintenance and replacement support'
    }
];
