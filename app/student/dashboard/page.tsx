'use client';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, Target, Play, FileText, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ProgressRing from '@/components/dashboard/ProgressRing';
import { ChartCard, BarChartComponent } from '@/components/dashboard/Charts';
import { getStudentDashboardStats } from '@/lib/actions/student.actions';
import { getCertificateCount } from '@/lib/actions/certificate.actions';
import { getCourseMaterials } from '@/lib/actions/material.actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const studentWatchTime = [
    { day: 'Mon', minutes: 0 },
    { day: 'Tue', minutes: 0 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 0 },
    { day: 'Sat', minutes: 0 },
    { day: 'Sun', minutes: 0 },
];

export default function StudentDashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();


    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalEnrolled: 0,
        certificatesCount: 0,
        watchTime: "0 hrs",
        overallProgress: "0%"
    });
    const [recentMaterials, setRecentMaterials] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (isLoading || !user || user.role !== 'student') return;

            setIsLoadingData(true);
            try {
                // 1. Fetch Student Stats & Enrolled Courses
                const data = await getStudentDashboardStats(user.id);

                if (data) {
                    setEnrolledCourses(data.enrolledCourses);

                    // 2. Fetch Certificates Count
                    const certCount = await getCertificateCount(user.id);

                    // 3. Update Stats
                    setStats(prev => ({
                        ...prev,
                        totalEnrolled: data.totalEnrolled,
                        certificatesCount: certCount,
                        overallProgress: data.overallProgress,
                        watchTime: data.watchTime
                    }));

                    // 4. Fetch Materials for first course if available
                    if (data.enrolledCourses.length > 0) {
                        const materials = await getCourseMaterials(data.enrolledCourses[0].id);
                        setRecentMaterials(materials.slice(0, 3));
                    }
                }

            } catch (error) {
                console.error("Dashboard Load Error:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user, isLoading]);

    if (isLoading || isLoadingData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user || user.role !== 'student') return null;

    const student = user;
    const currentCourse = enrolledCourses[0];

    // Mock progress calculation based on fetched course
    const progressData = currentCourse ? {
        courseName: currentCourse.title,
        progress: 0, // Default to 0 until real progress tracking is implemented
        totalLessons: currentCourse.curriculum?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0,
        completedLessons: 0,
        timeSpent: 0,
        lastAccessed: 'Never'
    } : null;

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
                    <StatCard icon={BookOpen} title="Enrolled Courses" value={stats.totalEnrolled} color="primary" />
                    <StatCard icon={Clock} title="Watch Time" value={stats.watchTime} change="+2.5 hrs" changeType="positive" color="secondary" />
                    <StatCard icon={Award} title="Certificates" value={stats.certificatesCount} color="success" />
                    <StatCard icon={Target} title="Overall Progress" value={stats.overallProgress} change="+5%" changeType="positive" color="accent" />
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
                        {recentMaterials.length > 0 ? recentMaterials.map((mat, i) => (
                            <div
                                key={mat.id || i}
                                onClick={() => handleDownload(mat.title)}
                                className="flex items-center gap-3 p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{mat.title}</p>
                                    <p className="text-xs text-muted-foreground">{mat.type?.toUpperCase()} • {mat.size || 'N/A'}</p>
                                </div>
                            </div>
                        )) : (
                            !currentCourse ? <p className="text-muted-foreground text-sm">Enroll in a course to see materials.</p>
                                : <p className="text-muted-foreground text-sm">No recent materials found.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
