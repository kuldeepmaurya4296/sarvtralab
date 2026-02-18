import React from 'react';

export function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Sarvtra Labs',
        alternateName: ['Sarvtra', 'Sarvatra Labs', 'Sarwatra Labs'],
        url: 'https://sarvtralabs.com',
        logo: 'https://sarvtralabs.com/logo.png',
        sameAs: [
            'https://twitter.com/sarvtralabs',
            'https://linkedin.com/company/sarvtralabs',
            'https://facebook.com/sarvtralabs',
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function CourseSchema({ course }: { course: any }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        provider: {
            '@type': 'Organization',
            name: 'Sarvtra Labs',
            sameAs: 'https://sarvtralabs.com',
        },
        educationalLevel: course.level,
        offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: 'INR',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
