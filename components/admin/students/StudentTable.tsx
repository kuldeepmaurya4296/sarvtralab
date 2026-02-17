
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash2, School } from 'lucide-react';
import { Student } from '@/data/users';
import { StudentService } from '@/data/services/student.service';

interface StudentTableProps {
    students: Student[];
    onView: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
}

export function StudentTable({ students, onView, onEdit, onDelete }: StudentTableProps) {
    if (students.length === 0) {
        return (
            <div className="rounded-md border p-8 text-center text-muted-foreground">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Enrolled Courses</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No students found matching your filters.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Enrolled Courses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student) => (
                        <TableRow
                            key={student.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={(e) => {
                                // Prevent open details when clicking actions
                                if ((e.target as any).closest('.action-btn')) return;
                                onView(student);
                            }}
                        >
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
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <School className="h-3 w-3" />
                                    <span className="text-sm">{StudentService.getSchoolName(student.schoolId)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{student.grade}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                    {student.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{student.enrolledCourses.length}</span>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 action-btn">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(student.id); }}>
                                            Copy ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(student); }}>
                                            <Eye className="mr-2 h-4 w-4" /> View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(student); }}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={(e) => { e.stopPropagation(); onDelete(student); }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Suspend User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
