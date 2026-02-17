'use client';

import {
    MoreVertical, Eye, Phone, BookOpen,
    School as SchoolIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student } from '@/data/users';

interface GovtStudentTableProps {
    students: Student[];
    onView: (student: Student) => void;
    onContact: (student: Student) => void;
}

export function GovtStudentTable({ students, onView, onContact }: GovtStudentTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>School & Grade</TableHead>
                        <TableHead>Parent / Contact</TableHead>
                        <TableHead>Courses Enrolled</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No students found matching your filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} />
                                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{student.name}</span>
                                            <span className="text-xs text-muted-foreground">{student.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            <SchoolIcon className="h-3 w-3 text-muted-foreground" />
                                            {student.schoolName}
                                        </div>
                                        <span className="text-xs text-muted-foreground bg-muted w-fit px-1.5 py-0.5 rounded mt-0.5">
                                            {student.grade}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm">{student.parentName}</span>
                                        <span className="text-xs text-muted-foreground">{student.parentPhone}</span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{student.parentEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="secondary" className="w-fit">
                                            {student.enrolledCourses.length} Active Courses
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            {student.completedCourses.length} Completed
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {(() => {
                                        // Deterministic score from student ID to avoid hydration mismatch
                                        const hash = student.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                                        const score = (hash % 40) + 60;
                                        return (
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-secondary rounded-full h-2 w-16">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium">{score}%</span>
                                            </div>
                                        );
                                    })()}
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
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
                                                Copy Student ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onView(student)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Academic Record
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onContact(student)}>
                                                <Phone className="mr-2 h-4 w-4" /> Contact Parent
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
    );
}
