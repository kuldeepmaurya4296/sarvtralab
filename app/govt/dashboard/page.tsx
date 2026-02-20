'use client';
import { useEffect, useState } from 'react';
import { Building, Users, TrendingUp, FileText } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import FilterTabs from '@/components/dashboard/FilterTabs';
import { ChartCard, AreaChartComponent, BarChartComponent } from '@/components/dashboard/Charts';
import { monthlyData, gradeDistribution } from '@/data/analytics';
import { getGovtDashboardStats } from '@/lib/actions/dashboard.actions';
import { GovtOrg } from '@/data/users';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function GovtDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [period, setPeriod] = useState('Monthly');
    const [stats, setStats] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'govt')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.role === 'govt') {
                try {
                    const data = await getGovtDashboardStats();
                    setStats(data);
                } catch (e) {
                    console.error("Failed to load govt stats", e);
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
    if (!user || user.role !== 'govt') return null;
    if (!stats) return <div>Error loading data.</div>;

    const govtOrg = user as GovtOrg;
    const { totalSchools, totalStudents, schools } = stats;

    return (
        <DashboardLayout role="govt" userName={govtOrg.name} userEmail={govtOrg.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{govtOrg.organizationName}</h1>
                        <p className="text-muted-foreground">{govtOrg.department} • {govtOrg.jurisdiction} Level</p>
                    </div>
                    <FilterTabs options={['Weekly', 'Monthly', 'Yearly']} value={period} onChange={setPeriod} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Building} title="Schools Under Jurisdiction" value={totalSchools} color="primary" />
                    <StatCard icon={Users} title="Total Students" value={totalStudents.toLocaleString()} change="+320" changeType="positive" color="secondary" />
                    <StatCard icon={TrendingUp} title="Avg Completion Rate" value={stats.avgCompletion} color="success" />
                    <StatCard icon={FileText} title="Reports Generated" value={stats.reportsCount} color="accent" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Student Growth Trend" subtitle="Monthly enrollment">
                        <AreaChartComponent data={monthlyData} dataKey="students" color="hsl(var(--accent))" />
                    </ChartCard>
                    <ChartCard title="Grade Distribution" subtitle="Students by grade">
                        <BarChartComponent data={stats.gradeDistribution || []} dataKey="students" xAxisKey="grade" color="hsl(var(--primary))" />
                    </ChartCard>
                </div>

                <div className="p-6 rounded-2xl bg-card border shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Schools Overview</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b text-left text-sm text-muted-foreground">
                                <th className="pb-3 px-2">School Name</th><th className="pb-3 px-2">City</th><th className="pb-3 px-2">Students</th><th className="pb-3 px-2">Status</th>
                            </tr></thead>
                            <tbody>
                                {schools.map((school: any) => (
                                    <tr key={school.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-2 font-medium">{school.name}</td>
                                        <td className="py-3 px-2 text-muted-foreground">{school.city}</td>
                                        <td className="py-3 px-2">{school.totalStudents}</td>
                                        <td className="py-3 px-2"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
