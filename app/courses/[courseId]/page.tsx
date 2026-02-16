'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Clock, Star, ArrowLeft, IndianRupee, Check, Play,
    FileText, Trophy, BookOpen, Award, Calendar
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { courses } from '@/data/courses';

export default function CourseDetailPage() {
    const { courseId } = useParams();
    const course = courses.find((c) => c.id === courseId);

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
        <PublicLayout>
            {/* Breadcrumb */}
            <section className="pt-24 pb-4 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{course.title}</span>
                    </div>
                </div>
            </section>

            {/* Hero */}
            <section className="py-12 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left - Course Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4
                ${course.category === 'foundation' ? 'bg-primary/10 text-primary' :
                                    course.category === 'intermediate' ? 'bg-orange-100 text-orange-600' :
                                        'bg-cyan-100 text-cyan-600'
                                }`}>
                                {course.grade} • {course.level}
                            </span>

                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {course.title}
                            </h1>

                            <p className="text-lg text-muted-foreground mb-6">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                                    <span className="font-semibold">{course.rating}</span>
                                    <span className="text-muted-foreground">({course.studentsEnrolled.toLocaleString()} students)</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-5 h-5" />
                                    <span>{course.totalHours} hours</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <span>{course.duration}</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6">
                                Instructor: <span className="font-semibold text-foreground">{course.instructor}</span>
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {course.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-white border rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:pl-8"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-24">
                                <div className="aspect-video bg-muted rounded-xl mb-6 overflow-hidden">
                                    <img
                                        src="/robotics-illustration.jpg"
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-4xl font-bold text-foreground">
                                        ₹{course.price.toLocaleString()}
                                    </span>
                                    <span className="text-xl text-muted-foreground line-through">
                                        ₹{course.originalPrice.toLocaleString()}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 ml-2">
                                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                    </span>
                                </div>

                                {course.emiAvailable && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg mb-6 border border-green-100">
                                        <IndianRupee className="w-5 h-5 text-green-600" />
                                        <div>
                                            <span className="text-green-600 font-bold block text-sm">0% EMI Available</span>
                                            <span className="text-muted-foreground text-xs">from ₹{course.emiAmount}/month for {course.emiMonths} months</span>
                                        </div>
                                    </div>
                                )}

                                <Link href="/signup" className="block w-full mb-3">
                                    <Button className="w-full h-12 text-lg font-bold">
                                        Enroll Now
                                    </Button>
                                </Link>

                                <Button variant="outline" className="w-full mb-6 h-12 font-medium">
                                    Book Free Demo
                                </Button>

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="font-medium text-foreground">{course.sessions} sessions total</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="font-medium text-foreground">Robotics Kit Included</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="font-medium text-foreground">Certification on completion</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-10">Course Curriculum</h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {course.curriculum.map((module) => (
                            <Accordion key={module.id} type="single" collapsible>
                                <AccordionItem value={module.id} className="border rounded-2xl overflow-hidden px-4">
                                    <AccordionTrigger className="hover:no-underline py-6">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {module.lessons.length}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{module.title}</h4>
                                                <p className="text-sm text-muted-foreground">{module.duration}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="space-y-4 pt-4 border-t">
                                            {module.lessons.map((lesson) => (
                                                <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                        {lesson.type === 'video' ? <Play className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-accent" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{lesson.title}</p>
                                                        <p className="text-xs text-muted-foreground uppercase">{lesson.type} • {lesson.duration}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
