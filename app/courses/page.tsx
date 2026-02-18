import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CoursesContent from '@/components/courses/CoursesList';
import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
    title: 'Robotics & AI Courses',
    description: 'Explore our comprehensive robotics and AI courses designed for students from grades 1 to 12. Align with CBSE and NEP 2020 at Sarvtra Labs.',
    keywords: ['Robotics Courses', 'AI for Kids', 'STEM Education', 'Sarvtra Labs Courses', 'Sarwatra Labs', 'Labs'],
});

export default function CoursesPage() {
    return (
        <PublicLayout>
            <Suspense fallback={<div className="pt-32 pb-16 text-center">Loading courses...</div>}>
                <CoursesContent />
            </Suspense>
        </PublicLayout>
    );
}
