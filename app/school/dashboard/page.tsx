'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import FilterTabs from '@/components/dashboard/FilterTabs';
import { ChartCard, AreaChartComponent, MultiBarChartComponent } from '@/components/dashboard/Charts';
import { weeklyData, courseEnrollment } from '@/data/analytics'; // Keep charts staticish for now as generating time-series from flat data is complex
import { mockSchools, mockStudents } from '@/data/users';

export default function SchoolDashboardPage() {
    // 1. Identify School (Simulating Auth)
    const school = mockSchools[0]; // DPS Noida
    const [period, setPeriod] = useState('Weekly');

    // 2. Dynamic Calcs
    const schoolStudents = useMemo(() =>
        mockStudents.filter(s => s.schoolId === school.id),
        [school.id]);

    const totalStudents = schoolStudents.length;
    const activeStudents = schoolStudents.filter(s => s.enrolledCourses.length > 0).length;
    const coursesAssigned = school.assignedCourses.length;

    // Mock completion rate calc
    const completedCount = schoolStudents.reduce((acc, s) => acc + s.completedCourses.length, 0);
    const enrolledCount = schoolStudents.reduce((acc, s) => acc + s.enrolledCourses.length, 0);
    const completionRate = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;

    // Top Performers (Mock logic - just pick random students)
    const topPerformers = schoolStudents.slice(0, 3).map(s => s.name);

    return (
        <DashboardLayout role="school" userName={school.principalName} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{school.name}</h1>
                        <p className="text-muted-foreground">School Dashboard Overview</p>
                    </div>
                    <FilterTabs options={['Weekly', 'Monthly', 'Yearly']} value={period} onChange={setPeriod} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} title="Total Students" value={totalStudents} change="+12" changeType="positive" color="primary" />
                    <StatCard icon={Users} title="Active Students" value={activeStudents} color="secondary" />
                    <StatCard icon={BookOpen} title="Courses Assigned" value={coursesAssigned} color="accent" />
                    <StatCard icon={Award} title="Completion Rate" value={`${completionRate}%`} change="+3%" changeType="positive" color="success" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Student Activity" subtitle="Enrollments over time">
                        <AreaChartComponent data={weeklyData} dataKey="students" color="hsl(var(--primary))" />
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
                        {topPerformers.length > 0 ? topPerformers.map((name, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-sm">
                                    {i + 1}
                                </div>
                                <span className="font-medium">{name}</span>
                                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Top Scorer</span>
                            </div>
                        )) : <p className="text-muted-foreground text-sm">No students yet.</p>}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
