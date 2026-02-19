'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Users, Search, Eye, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function TeacherStudentsPage() {
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

    const students = [
        { id: 's1', name: 'Arjun Patel', email: 'arjun@student.sarvtralab.in', grade: 'Grade 8', course: 'Robotics Fundamentals', progress: 85, status: 'active' },
        { id: 's2', name: 'Priya Sharma', email: 'priya@student.sarvtralab.in', grade: 'Grade 9', course: 'Python for Beginners', progress: 62, status: 'active' },
        { id: 's3', name: 'Rahul Gupta', email: 'rahul@student.sarvtralab.in', grade: 'Grade 10', course: 'Arduino Workshop', progress: 91, status: 'active' },
        { id: 's4', name: 'Sneha Reddy', email: 'sneha@student.sarvtralab.in', grade: 'Grade 8', course: 'Robotics Fundamentals', progress: 45, status: 'inactive' },
        { id: 's5', name: 'Vikram Singh', email: 'vikram@student.sarvtralab.in', grade: 'Grade 11', course: 'Advanced Coding Lab', progress: 30, status: 'active' },
        { id: 's6', name: 'Meera Nair', email: 'meera@student.sarvtralab.in', grade: 'Grade 9', course: 'Python for Beginners', progress: 78, status: 'active' },
    ];

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout role="teacher" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" /> My Students
                        </h1>
                        <p className="text-muted-foreground">Students enrolled in your courses</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search students..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No students found.</TableCell>
                                        </TableRow>
                                    ) : filtered.map(s => (
                                        <TableRow key={s.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{s.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <span className="font-medium">{s.name}</span>
                                                        <p className="text-xs text-muted-foreground">{s.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{s.grade}</TableCell>
                                            <TableCell className="text-sm">{s.course}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-muted rounded-full h-1.5">
                                                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${s.progress}%` }} />
                                                    </div>
                                                    <span className="text-xs font-medium">{s.progress}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={s.status === 'active' ? 'default' : 'secondary'} className="capitalize">{s.status}</Badge>
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
