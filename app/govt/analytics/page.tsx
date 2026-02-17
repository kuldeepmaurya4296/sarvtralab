'use client';

import { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    School,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockGovtOrgs } from '@/data/users';
import {
    monthlyData,
    studentWatchTime,
    gradeDistribution,
    courseEnrollment
} from '@/data/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ChartCard,
    AreaChartComponent,
    BarChartComponent,
    MultiBarChartComponent
} from '@/components/dashboard/Charts';
import StatCard from '@/components/dashboard/StatCard';
import FilterTabs from '@/components/dashboard/FilterTabs';

export default function GovtAnalyticsPage() {
    const govtOrg = mockGovtOrgs[0];
    const [period, setPeriod] = useState('Monthly');

    return (
        <DashboardLayout role="govt" userName={govtOrg.name} userEmail={govtOrg.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-primary" />
                            Analytics Overview
                        </h1>
                        <p className="text-muted-foreground">
                            Deep dive into performance metrics and key indicators
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterTabs options={['Weekly', 'Monthly', 'Yearly']} value={period} onChange={setPeriod} />
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Users}
                        title="Total Enrollment"
                        value="15,420"
                        change="+12.5%"
                        changeType="positive"
                        color="primary"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Completion Rate"
                        value="78.5%"
                        change="+2.4%"
                        changeType="positive"
                        color="success"
                    />
                    <StatCard
                        icon={School}
                        title="Active Schools"
                        value="128"
                        change="+4"
                        changeType="positive"
                        color="secondary"
                    />
                    <StatCard
                        icon={Calendar}
                        title="Avg. Attendance"
                        value="92%"
                        change="-1.2%"
                        changeType="negative"
                        color="accent"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Enrollment Trends" subtitle="New students over time">
                        <AreaChartComponent
                            data={monthlyData}
                            dataKey="students"
                            color="hsl(var(--primary))"
                        />
                    </ChartCard>
                    <ChartCard title="Grade Distribution" subtitle="Student count by grade level">
                        <BarChartComponent
                            data={gradeDistribution}
                            dataKey="students"
                            xAxisKey="grade"
                            color="hsl(var(--secondary))"
                        />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Course Performance</CardTitle>
                            <CardDescription>Enrollment vs Completion across courses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {/* Custom simple bar chart implementation for multiple keys if BarChartComponent doesn't support it easily, 
                                   or just reuse BarChartComponent for one metric for now. 
                                   Let's visualize 'enrolled' vs 'completed' using a stacked or grouped approach implies complexity. 
                                   For now, I'll use a simple list or reuse BarChartComponent for 'enrolled'.
                                */}
                                <MultiBarChartComponent
                                    data={courseEnrollment}
                                    bars={[
                                        { dataKey: 'enrolled', color: 'hsl(var(--primary))', name: 'Enrolled' },
                                        { dataKey: 'completed', color: 'hsl(var(--success))', name: 'Completed' }
                                    ]}
                                    xAxisKey="course"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Insights</CardTitle>
                            <CardDescription>Automated analysis generated from your data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <span className="p-2 bg-green-100 text-green-700 rounded-full">
                                    <TrendingUp className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium">Enrollment Spike</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Enrollment in Foundation Robotics increased by 24% this month.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <span className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                                    <Users className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium">Retention Alert</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Attendance in District A schools dropped by 5% last week.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <span className="p-2 bg-blue-100 text-blue-700 rounded-full">
                                    <School className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium">New Schools</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        4 new schools onboarded in the Northern Zone.
                                    </p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
