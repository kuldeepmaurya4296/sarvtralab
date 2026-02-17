'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    MoreVertical,
    GraduationCap,
    School,
    BookOpen
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockTeachers, mockSchools } from '@/data/users';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminTeachersPage() {
    const admin = mockSuperAdmin;
    const allTeachers = mockTeachers;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTeachers = allTeachers.filter(teacher => {
        return teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getSchoolNames = (schoolIds: string[]) => {
        return mockSchools
            .filter(s => schoolIds.includes(s.id))
            .map(s => s.name)
            .join(', ');
    };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Manage Teachers
                        </h1>
                        <p className="text-muted-foreground">
                            Global teacher registry and assignments
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Add Teacher
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Registered Teachers</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search teachers..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredTeachers.length} of {allTeachers.length} qualified instructors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Specialization</TableHead>
                                        <TableHead>Experience</TableHead>
                                        <TableHead>Assigned Schools</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTeachers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No teachers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTeachers.map((teacher) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} alt={teacher.name} />
                                                            <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">{teacher.name}</span>
                                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{teacher.specialization}</span>
                                                        <span className="text-xs text-muted-foreground">{teacher.qualifications}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{teacher.experience} Years</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-muted-foreground text-sm max-w-[200px] truncate" title={getSchoolNames(teacher.assignedSchools)}>
                                                        <School className="h-3 w-3 inline mr-1" />
                                                        {getSchoolNames(teacher.assignedSchools) || 'None'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                        {teacher.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(teacher.id)}>
                                                                Copy ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                            <DropdownMenuItem>Assign Schools</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">
                                                                Deactivate Account
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
