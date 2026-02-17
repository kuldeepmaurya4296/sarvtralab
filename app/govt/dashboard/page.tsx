'use client';
import { useEffect, useState } from 'react';
import { Building, Users, TrendingUp, FileText } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import FilterTabs from '@/components/dashboard/FilterTabs';
import { ChartCard, AreaChartComponent, BarChartComponent } from '@/components/dashboard/Charts';
import { monthlyData, gradeDistribution } from '@/data/analytics';
import { db } from '@/data/services/database';
import { GovtOrg } from '@/data/users';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function GovtDashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [period, setPeriod] = useState('Monthly');

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'govt')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'govt') return null;

    const govtOrg = user as GovtOrg;

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
                    <StatCard icon={Building} title="Schools Under Jurisdiction" value={db.schools.count()} color="primary" />
                    <StatCard icon={Users} title="Total Students" value="5,500" change="+320" changeType="positive" color="secondary" />
                    <StatCard icon={TrendingUp} title="Avg Completion Rate" value="72%" color="success" />
                    <StatCard icon={FileText} title="Reports Generated" value={24} color="accent" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Student Growth Trend" subtitle="Monthly enrollment">
                        <AreaChartComponent data={monthlyData} dataKey="students" color="hsl(var(--accent))" />
                    </ChartCard>
                    <ChartCard title="Grade Distribution" subtitle="Students by grade">
                        <BarChartComponent data={gradeDistribution} dataKey="students" xAxisKey="grade" color="hsl(var(--primary))" />
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
                                {db.schools.find().map((school) => (
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
