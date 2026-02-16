
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export interface ContactDetail {
    iconName: string; // Storing icon name as string for mapping in component
    title: string;
    content: string;
    subtext?: string;
    link?: string;
}

export interface SocialProfile {
    platform: string;
    url: string;
    iconName: string;
}

export const organizationDetails = {
    name: 'Sarvtra Lab',
    tagline: 'Innovating Education for Future',
    description: 'Sarvtra Lab is India\'s premier robotics education platform, dedicated to making STEM education accessible, engaging, and aligned with global standards.',
    contact: {
        email: 'hello@sarvtralab.in',
        phone: '+91 1800 123 4567',
        address: 'Sector 62, Noida, UP 201301',
        hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.37!3d28.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzEyLjAiTiA3N8KwMjInMTIuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'
    },
    socials: [
        { platform: 'Facebook', url: 'https://facebook.com', iconName: 'Facebook' },
        { platform: 'Twitter', url: 'https://twitter.com', iconName: 'Twitter' },
        { platform: 'Instagram', url: 'https://instagram.com', iconName: 'Instagram' },
        { platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin' },
        { platform: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube' }
    ] as SocialProfile[],
    stats: [
        { label: 'Students Trained', value: '15,000+', iconName: 'Users' },
        { label: 'Partner Schools', value: '120+', iconName: 'School' },
        { label: 'States Covered', value: '18', iconName: 'MapPin' },
        { label: 'Competition Winners', value: '250+', iconName: 'Trophy' }
    ]
};

export const contactCards: ContactDetail[] = [
    {
        iconName: 'Mail',
        title: 'Email Us',
        content: organizationDetails.contact.email,
        subtext: 'We reply within 24 hours',
        link: `mailto:${organizationDetails.contact.email}`
    },
    {
        iconName: 'Phone',
        title: 'Call Us',
        content: organizationDetails.contact.phone,
        subtext: 'Mon-Sat, 9am-6pm IST',
        link: `tel:${organizationDetails.contact.phone.replace(/\s+/g, '')}`
    },
    {
        iconName: 'MapPin',
        title: 'Visit Us',
        content: organizationDetails.contact.address,
        subtext: 'By appointment only',
        link: '#'
    },
    {
        iconName: 'Clock',
        title: 'Business Hours',
        content: organizationDetails.contact.hours,
        subtext: 'Sunday: Closed'
    }
];
