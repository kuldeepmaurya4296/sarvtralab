import { Metadata } from 'next';

export const SITE_CONFIG = {
    name: 'Sarvtra Labs',
    url: 'https://sarvtralabs.com', // Replace with actual production URL
    description: 'An innovative education platform connecting students, schools, and government. Explore robotics, AI, and modern technologies with Sarvtra Labs.',
    keywords: [
        'Sarvtra',
        'Labs',
        'Sarvatra Labs',
        'Sarwatra Labs',
        'EduTech',
        'Robotics for kids',
        'AI Education India',
        'Online Learning Platform',
        'Sarvtra Education',
        'STEM Learning',
    ],
    author: 'Sarvtra Labs',
    ogImage: '/og-image.jpg', // Make sure this exists
};

export function constructMetadata({
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    image = SITE_CONFIG.ogImage,
    icons = {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
        other: [
            {
                rel: 'manifest',
                url: '/site.webmanifest',
            },
        ],
    },
    noIndex = false,
    canonical,
    keywords = SITE_CONFIG.keywords,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: any;
    noIndex?: boolean;
    canonical?: string;
    keywords?: string[];
} = {}): Metadata {
    return {
        title: {
            default: title,
            template: `%s | ${SITE_CONFIG.name}`,
        },
        description,
        keywords: keywords.join(', '),
        authors: [{ name: SITE_CONFIG.author }],
        creator: SITE_CONFIG.author,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: SITE_CONFIG.url,
            title,
            description,
            siteName: SITE_CONFIG.name,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@sarvtralabs',
        },
        icons,
        metadataBase: new URL(SITE_CONFIG.url),
        ...(canonical && { alternates: { canonical } }),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
