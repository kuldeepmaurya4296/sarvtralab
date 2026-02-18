import React from 'react';

export function CourseListSchema({ courses }: { courses: any[] }) {
    const minifiedSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: courses.map((course, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Course',
                name: course.title,
                description: course.description,
                provider: {
                    '@type': 'Organization',
                    name: 'Sarvtra Labs',
                    sameAs: 'https://sarvtralabs.com',
                },
                educationalLevel: course.grade,
                offers: {
                    '@type': 'Offer',
                    price: course.price,
                    priceCurrency: 'INR',
                },
                url: `https://sarvtralabs.com/courses/${course.id}`,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(minifiedSchema) }}
        />
    );
}
