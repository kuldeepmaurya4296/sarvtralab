import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import CoursesContent from '@/components/courses/CoursesList';
import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { CourseListSchema } from '@/components/seo/CourseListSchema';
import { getAllCourses } from '@/lib/actions/course.actions';
import { SEO_KEYWORDS } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
    title: 'Robotics & AI Courses in Bhopal | Sarvtra Labs',
    description: 'Explore our comprehensive robotics and AI courses designed for students from grades 1 to 12. Align with CBSE and NEP 2020 at Sarvtra Labs Bhopal.',
    keywords: [
        'Robotics Courses', 'AI for Kids', 'STEM Education', 'Sarvtra Labs Courses', 'Sarwatra Labs',
        'Robotics training in Bhopal', 'Robotic classes near me', 'Online robotics coding',
        ...SEO_KEYWORDS.slice(0, 50) // Use first 50 major keywords
    ],
});

export default async function CoursesPage() {
    const courses = await getAllCourses();

    return (
        <PublicLayout>
            <CourseListSchema courses={courses} />
            <Suspense fallback={<div className="pt-32 pb-16 text-center">Loading courses...</div>}>
                <CoursesContent initialCourses={courses} />
            </Suspense>
        </PublicLayout>
    );
}
