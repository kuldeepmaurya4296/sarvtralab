'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Clock, Award, ChevronRight, Download, FileText } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockStudents } from '@/data/users'; // Simulating DB fetch
import { courses } from '@/data/courses'; // Simulating DB fetch

// Simulate current user session
const currentUserId = 'std-001';
const currentUser = mockStudents.find(u => u.id === currentUserId);

export default function StudentCoursesPage() {
    if (!currentUser) return <div>User not found</div>;

    // Fetch enrolled courses details from "DB"
    const enrolledCoursesData = currentUser.enrolledCourses.map(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return null;

        // Calculate progress (mock logic for now, in real app would be from user progress record)
        const totalModules = course.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
        const completedModules = 0; // consistent with mock data for now
        const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

        // Find next lesson
        let nextLessonName = "Start Course";
        if (course.curriculum.length > 0 && course.curriculum[0].lessons.length > 0) {
            nextLessonName = course.curriculum[0].lessons[0].title;
        }

        return {
            ...course,
            progress,
            totalModules,
            completedModules,
            nextLesson: nextLessonName,
            lastAccessed: 'Just now'
        };
    }).filter(Boolean);

    // Fetch completed courses
    const completedCoursesData = currentUser.completedCourses.map(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return null;
        return {
            ...course,
            completionDate: '2024-01-01', // Mock date
            grade: 'A',
            certificate: 'Available'
        }
    }).filter(Boolean);


    return (
        <DashboardLayout role="student" userName={currentUser.name} userEmail={currentUser.email}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">My Courses</h1>
                    <p className="text-muted-foreground">Continue where you left off</p>
                </div>

                {/* Enrolled Courses */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        In Progress
                    </h2>
                    {enrolledCoursesData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCoursesData.map((course: any, index: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="h-40 bg-muted relative overflow-hidden">
                                        {/* Use specific images if available, else placeholder */}
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white">
                                            {course.title}
                                        </div>
                                        <div className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 bg-background/90 rounded backdrop-blur-sm shadow-sm">
                                            {course.category}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{course.title}</h3>
                                        <p className="text-xs text-muted-foreground mb-4">Last accessed {course.lastAccessed}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>{Math.round(course.progress)}% Complete</span>
                                                <span>{course.completedModules}/{course.totalModules} Lessons</span>
                                            </div>
                                            <Progress value={course.progress} className="h-2" />
                                        </div>

                                        <div className="bg-muted/50 p-3 rounded-lg mb-4">
                                            <p className="text-xs text-muted-foreground mb-1">Up Next:</p>
                                            <p className="text-sm font-medium flex items-center gap-2 line-clamp-1">
                                                <Play className="w-3 h-3 fill-current shrink-0" />
                                                {course.nextLesson}
                                            </p>
                                        </div>

                                        <Link href={`/student/courses/${course.id}`}>
                                            <Button className="w-full">
                                                Continue Learning
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border rounded-xl bg-muted/20">
                            <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                            <Link href="/courses">
                                <Button variant="link" className="mt-2">Browse Courses</Button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* Completed Courses */}
                {completedCoursesData.length > 0 && (
                    <section>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-green-600" />
                            Completed
                        </h2>
                        <div className="bg-card border rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                        <tr>
                                            <th className="px-6 py-4">Course Name</th>
                                            <th className="px-6 py-4">Completed On</th>
                                            <th className="px-6 py-4">Grade</th>
                                            <th className="px-6 py-4">Certificate</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {completedCoursesData.map((course: any) => (
                                            <tr key={course.id} className="hover:bg-muted/5">
                                                <td className="px-6 py-4 font-medium">{course.title}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{course.completionDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs border border-green-200">
                                                        Grade {course.grade}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button variant="outline" size="sm" className="h-8 gap-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                        <Award className="w-3 h-3" />
                                                        View
                                                    </Button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button variant="ghost" size="sm" className="h-8">Review</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}

                {/* Recommended */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recommended for You</h2>
                        <Link href="/courses" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                            Browse All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {courses.slice(0, 4).map(course => (
                            <Link key={course.id} href={`/courses/${course.id}`}>
                                <div className="bg-card border rounded-xl p-4 flex gap-4 hover:shadow-sm transition-shadow h-full cursor-pointer">
                                    <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }} />
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{course.title}</h4>
                                            <p className="text-xs text-muted-foreground">{course.level} • {course.totalHours} hrs</p>
                                        </div>
                                        <span className="text-xs font-bold text-primary mt-2">View Details</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
