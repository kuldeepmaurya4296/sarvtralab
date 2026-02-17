'use client';

import { useState } from 'react';
import {
    Users,
    BookOpen,
    TrendingUp,
    Award,
    Download
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools } from '@/data/users';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import { ChartCard, AreaChartComponent, BarChartComponent, PieChartComponent } from '@/components/dashboard/Charts';
import FilterTabs from '@/components/dashboard/FilterTabs';
import { monthlyData, gradeDistribution, courseEnrollment } from '@/data/analytics';

export default function SchoolAnalyticsPage() {
    const school = mockSchools[0];
    const [period, setPeriod] = useState('Monthly');

    // Mock data for school specific analytics
    const schoolPerformance = [
        { subject: 'Math', score: 85 },
        { subject: 'Science', score: 78 },
        { subject: 'English', score: 92 },
        { subject: 'History', score: 88 },
        { subject: 'Geography', score: 76 }
    ];

    const studentGrowth = [
        { month: 'Jan', students: 120 },
        { month: 'Feb', students: 135 },
        { month: 'Mar', students: 142 },
        { month: 'Apr', students: 155 },
        { month: 'May', students: 168 },
        { month: 'Jun', students: 180 }
    ];

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">School Analytics</h1>
                        <p className="text-muted-foreground">
                            Performance metrics and student insights
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterTabs options={['Weekly', 'Monthly', 'Yearly']} value={period} onChange={setPeriod} />
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Users}
                        title="Total Students"
                        value={school.totalStudents}
                        change="+12%"
                        changeType="positive"
                        color="primary"
                    />
                    <StatCard
                        icon={BookOpen}
                        title="Active Courses"
                        value={school.assignedCourses?.length || 0}
                        color="secondary"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Avg. Attendance"
                        value="94%"
                        change="+2%"
                        changeType="positive"
                        color="success"
                    />
                    <StatCard
                        icon={Award}
                        title="Pass Rate"
                        value="98%"
                        change="+1%"
                        changeType="positive"
                        color="accent"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Enrollment Growth" subtitle="New student registrations over time">
                        <AreaChartComponent
                            data={studentGrowth}
                            dataKey="students"
                            xAxisKey="month"
                            color="hsl(var(--primary))"
                        />
                    </ChartCard>
                    <ChartCard title="Subject Performance" subtitle="Average scores by subject">
                        <BarChartComponent
                            data={schoolPerformance}
                            dataKey="score"
                            xAxisKey="subject"
                            color="hsl(var(--secondary))"
                        />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ChartCard title="Grade Distribution" subtitle="Students by grade level">
                            <PieChartComponent
                                data={gradeDistribution.map(item => ({
                                    name: item.grade,
                                    value: item.students
                                }))}
                            />
                        </ChartCard>
                    </div>
                    <div className="lg:col-span-2">
                        <ChartCard title="Course Engagement" subtitle="Active students per course">
                            <BarChartComponent
                                data={courseEnrollment}
                                dataKey="enrolled"
                                xAxisKey="course"
                                color="hsl(var(--accent))"
                            />
                        </ChartCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
