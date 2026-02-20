'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { ChartCard, AreaChartComponent } from '@/components/dashboard/Charts';
import { getTeacherDashboardStats } from '@/lib/actions/dashboard.actions';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    FileText,
    Clock,
    TrendingUp,
    Calendar,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function TeacherDashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'teacher')) {
            router.push('/login');
        }

        const fetchStats = async () => {
            if (user?.id) {
                const data = await getTeacherDashboardStats(user.id);
                setStats(data);
                setIsLoadingStats(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, authLoading, router]);

    if (authLoading || isLoadingStats) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
    if (!user || user.role !== 'teacher') return null;

    const statCards = [
        { title: 'Assigned Courses', value: stats?.totalCourses || '0', icon: BookOpen, change: '+0', changeType: 'positive' as const },
        { title: 'Total Students', value: stats?.totalStudents || '0', icon: Users, change: '+0', changeType: 'positive' as const },
        { title: 'Materials Uploaded', value: stats?.totalMaterials || '0', icon: FileText, change: '+0', changeType: 'positive' as const },
        { title: 'Avg. Completion', value: `${stats?.avgCompletion || 0}%`, icon: TrendingUp, change: '+0', changeType: 'positive' as const },
    ];

    const recentCourses = stats?.recentCourses || [];
    const upcomingClasses = [
        { time: '10:00 AM', course: 'Robotics Fundamentals', type: 'Live', grade: 'Grade 8' },
        { time: '02:00 PM', course: 'Python for Beginners', type: 'Recorded', grade: 'Grade 9' },
        { time: '04:00 PM', course: 'Arduino Workshop', type: 'Lab', grade: 'Grade 10' },
    ];

    const studentEngagement = stats?.trendData?.length > 0 ? stats.trendData : [
        { name: 'Mon', students: 0 },
        { name: 'Tue', students: 0 },
        { name: 'Wed', students: 0 },
        { name: 'Thu', students: 0 },
        { name: 'Fri', students: 0 },
        { name: 'Sat', students: 0 },
        { name: 'Sun', students: 0 },
    ];

    return (
        <DashboardLayout role="teacher" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Good Morning, {user.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-muted-foreground">Here&apos;s your teaching overview for today</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat: any, idx: number) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* My Courses */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">My Courses</CardTitle>
                                    <Link href="/teacher/courses">
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            View All <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentCourses.map((course: any) => (
                                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{course.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students} students</span>
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Next: {new Date(course.nextClass).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-24 space-y-1 hidden sm:block">
                                            <div className="flex justify-between text-xs">
                                                <span>Progress</span>
                                                <span className="font-medium">{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className="h-1.5" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Engagement Chart */}
                        <ChartCard title="Student Engagement This Week">
                            <AreaChartComponent
                                data={studentEngagement}
                                dataKey="students"
                                xAxisKey="name"
                                color="#6366f1"
                            />
                        </ChartCard>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Today's Schedule */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Today&apos;s Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {upcomingClasses.map((cls, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                                        <div className="text-center shrink-0 min-w-[60px]">
                                            <span className="text-sm font-bold text-primary">{cls.time}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">{cls.course}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{cls.type}</Badge>
                                                <span className="text-xs text-muted-foreground">{cls.grade}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href="/teacher/materials" className="block">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <FileText className="h-4 w-4" /> Upload Materials
                                    </Button>
                                </Link>
                                <Link href="/teacher/students" className="block">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Users className="h-4 w-4" /> View Students
                                    </Button>
                                </Link>
                                <Link href="/teacher/reports" className="block">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <TrendingUp className="h-4 w-4" /> View Reports
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
