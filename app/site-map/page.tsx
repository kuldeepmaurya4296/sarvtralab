
import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { courses } from '@/data/courses';

export const metadata = {
    title: 'Sitemap | Sarvtra Labs',
    description: 'Sitemap for Sarvtra Labs website.',
};

export default function SitemapPage() {
    const staticRoutes = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Courses', path: '/courses' },
        { name: 'Blog', path: '/blog' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Press', path: '/press' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Refund Policy', path: '/refund' },
        { name: 'Help Center', path: '/help' },
    ];

    return (
        <PublicLayout>
            <div className="bg-background pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Sitemap</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-primary">Main Pages</h2>
                            <ul className="space-y-2">
                                {staticRoutes.map((route) => (
                                    <li key={route.path}>
                                        <Link href={route.path} className="text-muted-foreground hover:text-primary transition-colors">
                                            {route.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-primary">Courses</h2>
                            <ul className="space-y-2">
                                {courses.map((course) => (
                                    <li key={course.id}>
                                        <Link href={`/courses/${course.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                                            {course.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-primary">Portals</h2>
                            <ul className="space-y-2">
                                <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
                                <li><Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link></li>
                                <li><Link href="/student/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Student Dashboard</Link></li>
                                <li><Link href="/school/dashboard" className="text-muted-foreground hover:text-primary transition-colors">School Dashboard</Link></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
