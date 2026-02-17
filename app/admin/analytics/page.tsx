'use client';

import { useState } from 'react';
import {
    Users,
    School as SchoolIcon,
    TrendingUp,
    IndianRupee,
    Download
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockSchools, mockStudents } from '@/data/users';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import { ChartCard, AreaChartComponent, BarChartComponent, PieChartComponent } from '@/components/dashboard/Charts';
import FilterTabs from '@/components/dashboard/FilterTabs';
import { monthlyData, gradeDistribution } from '@/data/analytics';
import { courses } from '@/data/courses';

export default function AdminAnalyticsPage() {
    const admin = mockSuperAdmin;
    const [period, setPeriod] = useState('Monthly');

    // Calculate revenue
    const totalRevenue = mockStudents.reduce((acc, student) => {
        const studentRevenue = student.enrolledCourses.reduce((courseAcc, cId) => {
            const course = courses.find(c => c.id === cId);
            return courseAcc + (course ? course.price : 0);
        }, 0);
        return acc + studentRevenue;
    }, 0);

    // Prepare course enrollment data
    const courseEnrollmentData = courses.map(course => ({
        name: course.title,
        students: course.studentsEnrolled,
        revenue: course.price * course.studentsEnrolled
    })).sort((a, b) => b.students - a.students).slice(0, 10);

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive system performance and growth metrics
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
                        title="Total Users"
                        value={mockStudents.length + 500} // Mocking parents/others 
                        change="+15%"
                        changeType="positive"
                        color="primary"
                    />
                    <StatCard
                        icon={SchoolIcon}
                        title="Active Schools"
                        value={mockSchools.length}
                        change="+2"
                        changeType="positive"
                        color="secondary"
                    />
                    <StatCard
                        icon={IndianRupee}
                        title="Total Revenue"
                        value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
                        change="+18%"
                        changeType="positive"
                        color="success"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Platform Growth"
                        value="24%"
                        change="+5%"
                        changeType="positive"
                        color="accent"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="User Growth" subtitle="New registrations across all roles">
                        <AreaChartComponent
                            data={monthlyData}
                            dataKey="students"
                            xAxisKey="month"
                            color="hsl(var(--primary))"
                        />
                    </ChartCard>
                    <ChartCard title="Revenue Trend" subtitle="Monthly revenue generation">
                        <BarChartComponent
                            data={monthlyData}
                            dataKey="revenue"
                            xAxisKey="month"
                            color="hsl(var(--success))"
                        />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ChartCard title="Student Demographics" subtitle="Distribution by grade">
                            <PieChartComponent
                                data={gradeDistribution.map(item => ({
                                    name: item.grade,
                                    value: item.students
                                }))}
                            />
                        </ChartCard>
                    </div>
                    <div className="lg:col-span-2">
                        <ChartCard title="Top Performing Courses" subtitle="Highest enrollment numbers">
                            <BarChartComponent
                                data={courseEnrollmentData}
                                dataKey="students"
                                xAxisKey="name"
                                color="hsl(var(--accent))"
                            />
                        </ChartCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
