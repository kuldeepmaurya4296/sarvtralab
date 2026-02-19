'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { ChartCard, AreaChartComponent, MultiBarChartComponent } from '@/components/dashboard/Charts';
import { BarChart3, Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherReportsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'teacher')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'teacher') return null;

    const monthlyStats = [
        { name: 'Sep', students: 85, completions: 12 },
        { name: 'Oct', students: 95, completions: 18 },
        { name: 'Nov', students: 105, completions: 22 },
        { name: 'Dec', students: 110, completions: 15 },
        { name: 'Jan', students: 120, completions: 28 },
        { name: 'Feb', students: 128, completions: 20 },
    ];

    const coursePerformance = [
        { name: 'Robotics', avgScore: 78, completion: 68 },
        { name: 'Python', avgScore: 72, completion: 45 },
        { name: 'Arduino', avgScore: 85, completion: 82 },
        { name: 'Coding', avgScore: 65, completion: 30 },
    ];

    return (
        <DashboardLayout role="teacher" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" /> Reports & Analytics
                    </h1>
                    <p className="text-muted-foreground">Track teaching performance and student progress</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Students" value="128" icon={Users} change="+12%" changeType="positive" />
                    <StatCard title="Courses Taught" value="4" icon={BookOpen} change="+1" changeType="positive" />
                    <StatCard title="Course Completions" value="48" icon={Award} change="+20%" changeType="positive" />
                    <StatCard title="Avg Score" value="75%" icon={TrendingUp} change="+5%" changeType="positive" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Student Enrollment & Completions">
                        <MultiBarChartComponent
                            data={monthlyStats}
                            bars={[
                                { dataKey: 'students', name: 'Enrolled', color: '#6366f1' },
                                { dataKey: 'completions', name: 'Completions', color: '#22c55e' },
                            ]}
                            xAxisKey="name"
                        />
                    </ChartCard>

                    <ChartCard title="Course Performance">
                        <MultiBarChartComponent
                            data={coursePerformance}
                            bars={[
                                { dataKey: 'avgScore', name: 'Avg Score %', color: '#f59e0b' },
                                { dataKey: 'completion', name: 'Completion %', color: '#6366f1' },
                            ]}
                            xAxisKey="name"
                        />
                    </ChartCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
