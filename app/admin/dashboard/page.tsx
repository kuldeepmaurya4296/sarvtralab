'use client';
import { useEffect, useState } from 'react';
import { Users, School, IndianRupee, TrendingUp, Building, Target } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
// import FilterTabs from '@/components/dashboard/FilterTabs';
import { ChartCard, LineChartComponent, PieChartComponent, MultiBarChartComponent } from '@/components/dashboard/Charts';
import { getAdminDashboardStats } from '@/lib/actions/dashboard.actions';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function AdminDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [period, setPeriod] = useState('Monthly');
    const [stats, setStats] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const data = await getAdminDashboardStats();
                    setStats(data);
                } catch (e) {
                    console.error("Failed to load admin stats", e);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) {
            fetchStats();
        }
    }, [user, isAuthLoading]);

    if (isAuthLoading || isLoadingData) return <div>Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;
    if (!stats) return <div>Error loading data.</div>;

    const admin = user as any;
    const { totalStudents, totalSchools, totalRevenue, pieData, recentSchools, chartData, courseEnrollment, crmStats, avgCompletionRate } = stats;

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
                        <p className="text-muted-foreground">Complete platform overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} title="Total Students" value={totalStudents} change="+12%" changeType="positive" color="primary" />
                    <StatCard icon={School} title="Partner Schools" value={totalSchools} change="+8" changeType="positive" color="secondary" />
                    <StatCard icon={IndianRupee} title="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} change="+18%" changeType="positive" color="success" />
                    <StatCard icon={TrendingUp} title="Completion Rate" value={`${avgCompletionRate}%`} color="accent" />
                    <StatCard icon={Target} title="Total Leads" value={crmStats?.totalLeads || 0} change={crmStats?.conversionRate + '% Conv.'} changeType="neutral" color="primary" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Growth Trends" subtitle="Students & Schools over time">
                        <LineChartComponent
                            data={chartData}
                            lines={[
                                { dataKey: 'students', color: 'hsl(var(--primary))', name: 'Students' },
                                { dataKey: 'schools', color: 'hsl(var(--secondary))', name: 'Schools' }
                            ]}
                        />
                    </ChartCard>
                    <ChartCard title="Course Distribution" subtitle="Available courses by track">
                        <PieChartComponent data={pieData} />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Schools List */}
                    <div className="p-6 rounded-2xl bg-card border shadow-sm h-full overflow-hidden flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Recent Schools</h3>
                        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                            {recentSchools.map((school: any) => (
                                <div key={school.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{school.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{school.city} • {school.totalStudents} students</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${school.subscriptionPlan === 'premium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{school.subscriptionPlan || 'basic'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ChartCard title="Course Performance" subtitle="Enrolled vs Completed">
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
            </div>
        </DashboardLayout>
    );
}
