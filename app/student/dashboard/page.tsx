'use client';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, Target, Play, FileText, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ProgressRing from '@/components/dashboard/ProgressRing';
import { ChartCard, BarChartComponent } from '@/components/dashboard/Charts';
import { db } from '@/data/services/database';
import { studentWatchTime } from '@/data/analytics';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Student } from '@/data/users';

export default function StudentDashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user || user.role !== 'student') return null;

    const student = user as Student;

    // 2. Fetch Enrolled Courses Data
    const enrolledCoursesDetails = student.enrolledCourses.map(courseId =>
        db.courses.findById(courseId)
    ).filter(Boolean);

    // 3. Calculate "Current Course" (taking the first one for now)
    const currentCourse = enrolledCoursesDetails[0];

    // Mock progress calculation
    const progressData = currentCourse ? {
        courseName: currentCourse.title,
        progress: 65, // Mock percentage
        totalLessons: currentCourse.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0),
        completedLessons: 8, // Mock
        timeSpent: 1250,
        lastAccessed: '2 days ago'
    } : null;

    // 4. Calculate Stats
    const totalEnrolled = student.enrolledCourses.length;
    const certificatesCount = db.certificates.count(c => c.studentId === student.id);
    // Mock other stats
    const watchTime = "20.8 hrs";
    const overallProgress = "65%";

    const handleDownload = (item: string) => {
        toast.info(`Downloading ${item}...`);
        setTimeout(() => toast.success("Download complete"), 1500);
    };

    return (
        <DashboardLayout role="student" userName={student.name} userEmail={student.email}>
            <div className="space-y-6">
                {/* Welcome */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back, {student.name.split(' ')[0]}! 👋</h1>
                    <p className="text-muted-foreground">Continue your learning journey</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={BookOpen} title="Enrolled Courses" value={totalEnrolled} color="primary" />
                    <StatCard icon={Clock} title="Watch Time" value={watchTime} change="+2.5 hrs" changeType="positive" color="secondary" />
                    <StatCard icon={Award} title="Certificates" value={certificatesCount} color="success" />
                    <StatCard icon={Target} title="Overall Progress" value={overallProgress} change="+5%" changeType="positive" color="accent" />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Current Course Progress */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 p-6 rounded-2xl bg-card border shadow-sm">
                        <h3 className="text-lg font-semibold mb-6">Current Course</h3>
                        {currentCourse && progressData ? (
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <ProgressRing progress={progressData.progress} size={140} />
                                <div className="flex-1">
                                    <h4 className="text-xl font-semibold text-foreground mb-2">{progressData.courseName}</h4>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p>Completed: {progressData.completedLessons}/{progressData.totalLessons} lessons</p>
                                        <p>Time Spent: {Math.floor(progressData.timeSpent / 60)} hours {progressData.timeSpent % 60} minutes</p>
                                        <p>Last Accessed: {progressData.lastAccessed}</p>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <Link href={`/student/courses/${currentCourse.id}`}>
                                            <Button className="gap-2">
                                                <Play className="w-4 h-4" /> Continue Learning
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No active courses. <Link href="/courses" className="text-primary hover:underline">Enroll now</Link>
                            </div>
                        )}
                    </motion.div>

                    {/* Weekly Watch Time */}
                    <ChartCard title="Weekly Watch Time" subtitle="Minutes per day">
                        <BarChartComponent data={studentWatchTime} dataKey="minutes" xAxisKey="day" color="hsl(var(--primary))" />
                    </ChartCard>
                </div>

                {/* Materials */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Recent Materials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentCourse?.category === 'foundation' && ['Introduction to Robotics', 'Basic Electronics Guide'].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => handleDownload(item)}
                                className="flex items-center gap-3 p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{item}</p>
                                    <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                                </div>
                            </div>
                        ))}
                        {!currentCourse && <p className="text-muted-foreground text-sm">Enroll in a course to see materials.</p>}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
