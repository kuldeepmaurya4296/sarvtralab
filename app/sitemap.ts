import { MetadataRoute } from 'next';
import { courses } from '@/data/courses';

const SITE_URL = 'https://sarvtralabs.com'; // Replace with actual URL

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/courses',
        '/blog',
        '/careers',
        '/contact',
        '/press',
        '/privacy',
        '/terms',
        '/refund',
        '/help',
    ].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const courseRoutes = courses.map((course) => ({
        url: `${SITE_URL}/courses/${course.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...courseRoutes];
}
