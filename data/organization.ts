
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
    name: 'Sarvtra Labs',
    tagline: 'Innovating Education for Future',
    description: 'Sarvtra Labs is India\'s premier robotics education platform, dedicated to making STEM education accessible, engaging, and aligned with global standards.',
    contact: {
        email: 'connect@pushpako2.com',
        phone: '+91-8085613350',
        address: '1, Aadi Parishar, Bagsewaniya, Sant Ashram Nagar, Bhel Sangam Colony, Face2, Bhopal Madhya Pradesh',
        hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.388836269417!2d77.46174487532353!3d23.22896577903158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43c4a6c4c4a1%3A0xc4c4c4c4c4c4c4c4!2sPushpak%20O2!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
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
