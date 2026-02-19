'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { Teacher, School } from '@/data/users';

interface TeacherAssignDialogProps {
    teacher: Teacher | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (schoolIds: string[]) => void;
    schools: School[];
}

export function TeacherAssignDialog({ teacher, open, onOpenChange, onSave, schools }: TeacherAssignDialogProps) {
    const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

    useEffect(() => {
        if (open && teacher) {
            setSelectedSchools(teacher.assignedSchools ? [...teacher.assignedSchools] : []);
        }
    }, [open, teacher]);

    if (!teacher) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Schools</DialogTitle>
                    <DialogDescription>
                        Select schools to assign to {teacher.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4 max-h-[300px] overflow-y-auto">
                    {schools.map(school => (
                        <div key={school.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`school-${school.id}`}
                                checked={selectedSchools.includes(school.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedSchools([...selectedSchools, school.id]);
                                    } else {
                                        setSelectedSchools(selectedSchools.filter(id => id !== school.id));
                                    }
                                }}
                            />
                            <Label htmlFor={`school-${school.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {school.name}
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={() => { onSave(selectedSchools); onOpenChange(false); }}>Save Assignments</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
