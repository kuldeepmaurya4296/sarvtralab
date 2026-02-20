import { Metadata } from 'next';
import { getCourseById } from '@/lib/actions/course.actions';
import CourseDetailContent from '@/components/courses/CourseDetailContent';
import PublicLayout from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import { CourseSchema } from '@/components/seo/StructuredData';

interface Props {
    params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { courseId } = await params;
    const course = await getCourseById(courseId);

    if (!course) {
        return constructMetadata({
            title: 'Course Not Found',
            description: 'The course you are looking for does not exist on Sarvtra Labs.',
        });
    }

    return constructMetadata({
        title: course.title,
        description: course.description,
        keywords: [course.title, ...(course.tags || []), 'Sarvtra Labs', 'Sarwatra Labs', 'Learning'],
    });
}

export default async function CourseDetailPage({ params }: Props) {
    const { courseId } = await params;
    const course = await getCourseById(courseId);

    if (!course) {
        return (
            <PublicLayout>
                <div className="pt-32 pb-16 text-center">
                    <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
                    <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
                    <Link href="/courses">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </Button>
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <>
            <CourseSchema course={course} />
            <CourseDetailContent course={course as any} />
        </>
    );
}
