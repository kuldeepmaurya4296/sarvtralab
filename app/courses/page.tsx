'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight, IndianRupee, Search } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { courses, courseCategories } from '@/data/courses';

// Component using searchParams must be wrapped in Suspense
const CoursesContent = () => {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    // In Next.js App Router with useSearchParams, we read the param. We can't "set" it directly to update URL without router.push.
    // But for local state filtering, we can default to 'all'.
    // However, the original code used search params to Filter.

    const activeCategory = searchParams.get('category') || 'all';

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Explore Our
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Robotics Courses</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            From beginners to advanced learners, find the perfect robotics program
                            aligned with CBSE curriculum and NEP 2020 guidelines.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 text-base bg-background/50 backdrop-blur-sm"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {/* Category Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap justify-center gap-4 mb-12"
                    >
                        <Link
                            href="/courses"
                            className={`px-6 py-3 rounded-full border-2 transition-all font-semibold
                ${activeCategory === 'all'
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border hover:border-primary/50'
                                }`}
                        >
                            All Courses
                        </Link>
                        {courseCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/courses?category=${category.id}`}
                                className={`px-6 py-3 rounded-full border-2 transition-all font-semibold
                  ${activeCategory === category.id
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                {category.name}
                                <span className="text-sm opacity-70 ml-2">({category.grades})</span>
                            </Link>
                        ))}
                    </motion.div>

                    {/* Results Count */}
                    <p className="text-center text-muted-foreground mb-8">
                        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                    </p>

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48 bg-muted">
                                    <img src="/robotics-illustration.jpg" alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${course.category === 'foundation' ? 'bg-primary text-primary-foreground' :
                                                course.category === 'intermediate' ? 'bg-orange-500 text-white' :
                                                    'bg-cyan-500 text-white'
                                            }`}>
                                            {course.grade}
                                        </span>
                                    </div>
                                    {course.emiAvailable && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold shadow-sm">
                                                <IndianRupee className="w-3 h-3" />
                                                0% EMI
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{course.totalHours} hrs</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.studentsEnrolled.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                                            <span>{course.rating}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <span className="text-2xl font-bold text-foreground">
                                                ₹{course.price.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-muted-foreground line-through ml-2">
                                                ₹{course.originalPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <Link href={`/courses/${course.id}`}>
                                            <Button size="sm" variant="outline" className="gap-1">
                                                View <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>

                                    {course.emiAvailable && (
                                        <p className="text-xs text-green-600 mt-2 font-medium">
                                            EMI from ₹{course.emiAmount?.toLocaleString()}/month
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">No courses found matching your criteria.</p>
                            <Link href="/courses">
                                <Button className="mt-4" onClick={() => setSearchQuery('')}>
                                    Clear Filters
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default function CoursesPage() {
    return (
        <PublicLayout>
            <Suspense fallback={<div className="pt-32 pb-16 text-center">Loading courses...</div>}>
                <CoursesContent />
            </Suspense>
        </PublicLayout>
    );
}
