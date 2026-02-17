'use client';

import {
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    CheckCircle2,
} from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student } from '@/data/users';

interface SchoolStudentTableProps {
    students: Student[];
    onView: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
}

export function SchoolStudentTable({ students, onView, onEdit, onDelete }: SchoolStudentTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Parent Info</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No students found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        students.map((student) => (
                            <TableRow
                                key={student.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={(e) => {
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
                                    <Badge variant="outline">{student.grade}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm">{student.parentName}</span>
                                        <span className="text-xs text-muted-foreground">{student.parentPhone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium">{student.enrolledCourses.length} Active</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                            {student.completedCourses?.length || 0} Completed
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                        {student.status}
                                    </Badge>
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
                                            <DropdownMenuItem onClick={() => onView(student)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(student)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(student)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Remove Student
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
