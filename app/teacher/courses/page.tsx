'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BookOpen, Users, Search, Eye, Calendar, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function TeacherCoursesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'teacher')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'teacher') return null;

    const courses = [
        { id: 'c1', title: 'Robotics Fundamentals', students: 42, progress: 68, status: 'active', grade: 'Grade 8', lessons: 24, completed: 16 },
        { id: 'c2', title: 'Python for Beginners', students: 35, progress: 45, status: 'active', grade: 'Grade 9', lessons: 30, completed: 13 },
        { id: 'c3', title: 'Arduino Workshop', students: 28, progress: 82, status: 'active', grade: 'Grade 10', lessons: 18, completed: 15 },
        { id: 'c4', title: 'Advanced Coding Lab', students: 23, progress: 30, status: 'active', grade: 'Grade 11', lessons: 20, completed: 6 },
        { id: 'c5', title: 'IoT Basics', students: 0, progress: 0, status: 'upcoming', grade: 'Grade 9', lessons: 16, completed: 0 },
    ];

    const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardLayout role="teacher" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" /> My Courses
                        </h1>
                        <p className="text-muted-foreground">Manage and track your assigned courses</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search courses..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead>Lessons</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No courses found.</TableCell>
                                        </TableRow>
                                    ) : filtered.map(c => (
                                        <TableRow key={c.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <BookOpen className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium">{c.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{c.grade}</TableCell>
                                            <TableCell><span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.students}</span></TableCell>
                                            <TableCell>{c.completed}/{c.lessons}</TableCell>
                                            <TableCell>
                                                <div className="w-24 space-y-1">
                                                    <Progress value={c.progress} className="h-1.5" />
                                                    <span className="text-xs text-muted-foreground">{c.progress}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="capitalize">{c.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
