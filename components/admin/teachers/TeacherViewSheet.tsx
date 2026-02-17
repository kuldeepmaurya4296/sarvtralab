'use client';

import {
    Mail,
    Phone,
    Briefcase,
    School,
    Edit,
    Trash2,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { Teacher } from '@/data/users';
import { TeacherService } from '@/data/services/teacher.service';

interface TeacherViewSheetProps {
    teacher: Teacher | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (teacher: Teacher) => void;
    onAssign: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
}

export function TeacherViewSheet({ teacher, open, onOpenChange, onEdit, onAssign, onDelete }: TeacherViewSheetProps) {
    if (!teacher) return null;

    const schools = TeacherService.getSchools().filter(s => teacher.assignedSchools.includes(s.id));

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Teacher Profile</SheetTitle>
                    <SheetDescription>
                        Detailed professional profile for {teacher.name}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                    {/* Header Info */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-20 w-20 border-2 border-primary/10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} />
                            <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold">{teacher.name}</h3>
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5" />
                                    {teacher.email}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5" />
                                    {teacher.phone || 'N/A'}
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                        {teacher.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Professional Info */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                Professional Details
                            </h4>
                            <div className="text-sm space-y-2 pl-6">
                                <div className="grid grid-cols-[100px_1fr] gap-1">
                                    <span className="text-muted-foreground">Specialization:</span>
                                    <span className="font-medium text-primary">{teacher.specialization}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-1">
                                    <span className="text-muted-foreground">Qualifications:</span>
                                    <span className="font-medium">{teacher.qualifications}</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-1">
                                    <span className="text-muted-foreground">Experience:</span>
                                    <span className="font-medium">{teacher.experience} Years</span>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-1">
                                    <span className="text-muted-foreground">Teacher ID:</span>
                                    <span className="font-mono text-xs py-0.5">{teacher.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Schools */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <School className="h-4 w-4 text-muted-foreground" />
                                Assigned Schools
                            </h4>
                            <div className="pl-6">
                                {schools.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {schools.map(school => (
                                            <div key={school.id} className="flex items-center gap-2 text-sm bg-muted/40 p-2 rounded">
                                                <School className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{school.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No schools assigned.</p>
                                )}
                                <Button variant="link" className="p-0 h-auto text-xs mt-2" onClick={() => { onOpenChange(false); onAssign(teacher); }}>
                                    + Manage Assignments
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions Footer */}
                    <div className="pt-4 flex flex-wrap gap-2">
                        <Button className="flex-1" onClick={() => { onOpenChange(false); onEdit(teacher); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => { onOpenChange(false); onAssign(teacher); }}>
                            <School className="mr-2 h-4 w-4" /> Assign Schools
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => { onOpenChange(false); onDelete(teacher); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
