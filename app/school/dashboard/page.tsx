'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
// import FilterTabs from '@/components/dashboard/FilterTabs';
import { ChartCard, AreaChartComponent, MultiBarChartComponent } from '@/components/dashboard/Charts';
import { getSchoolDashboardStats } from '@/lib/actions/dashboard.actions';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function SchoolDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [period, setPeriod] = useState('Weekly');
    const [stats, setStats] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'school')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.role === 'school') {
                try {
                    const data = await getSchoolDashboardStats(user.id);
                    setStats(data);
                } catch (e) {
                    console.error("Failed to fetch dashboard stats", e);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) {
            fetchStats();
        }
    }, [user, isAuthLoading]);

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'school') return null;

    if (!stats) return <div>Error loading data.</div>;

    const { schoolName, principalName, email, totalStudents, activeStudents, coursesAssigned, completionRate, topPerformers, chartData, courseEnrollment } = stats;

    return (
        <DashboardLayout role="school" userName={principalName} userEmail={email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{schoolName}</h1>
                        <p className="text-muted-foreground">School Dashboard Overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} title="Total Students" value={totalStudents} change="+12" changeType="positive" color="primary" />
                    <StatCard icon={Users} title="Active Students" value={activeStudents} color="secondary" />
                    <StatCard icon={BookOpen} title="Courses Assigned" value={coursesAssigned} color="accent" />
                    <StatCard icon={Award} title="Completion Rate" value={`${completionRate}%`} change="+3%" changeType="positive" color="success" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Student Activity" subtitle="Enrollments over time">
                        <AreaChartComponent data={chartData} dataKey="students" color="hsl(var(--primary))" />
                    </ChartCard>
                    <ChartCard title="Course Enrollment" subtitle="Enrolled vs Completed">
                        <MultiBarChartComponent
                            data={courseEnrollment}
                            bars={[
                                { dataKey: 'enrolled', color: 'hsl(var(--primary))', name: 'Enrolled' },
                                { dataKey: 'completed', color: 'hsl(var(--success))', name: 'Completed' }
                            ]}
                            xAxisKey="course"
                        />
                    </ChartCard>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                    <div className="space-y-3">
                        {topPerformers && topPerformers.length > 0 ? topPerformers.map((student: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-sm">
                                    {i + 1}
                                </div>
                                <span className="font-medium">{student.name}</span>
                                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {student.completed ? `${student.completed} Completed` : 'Top Scorer'}
                                </span>
                            </div>
                        )) : <p className="text-muted-foreground text-sm">No students yet.</p>}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
