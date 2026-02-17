
'use client';

import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StudentService } from '@/data/services/student.service';
import { Student } from '@/data/users';

interface StudentFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Student> | null;
    mode: 'add' | 'edit';
    onSubmit: (data: any) => void;
}

export function StudentFormSheet({ open, onOpenChange, initialData, mode, onSubmit }: StudentFormSheetProps) {
    const defaultForm = {
        name: '',
        email: '',
        grade: '',
        schoolId: '',
        status: 'active'
    };

    const [formData, setFormData] = useState(defaultForm);
    const [schools, setSchools] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            setSchools(StudentService.getSchools());
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    grade: initialData.grade || '',
                    schoolId: initialData.schoolId || '',
                    status: initialData.status || 'active'
                });
            } else {
                setFormData(defaultForm);
            }
        }
    }, [open, mode, initialData]);

    const handleSubmit = () => {
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{mode === 'add' ? 'Add New Student' : 'Edit Student'}</SheetTitle>
                    <SheetDescription>
                        {mode === 'add' ? 'Enter student details to create a new account.' : 'Update student details. Click save when you\'re done.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="grade" className="text-right">Grade</Label>
                        <Select
                            value={formData.grade}
                            onValueChange={(val) => setFormData({ ...formData, grade: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                                {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="school" className="text-right">School</Label>
                        <Select
                            value={formData.schoolId}
                            onValueChange={(val) => setFormData({ ...formData, schoolId: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select school" />
                            </SelectTrigger>
                            <SelectContent>
                                {schools.map(school => (
                                    <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </SheetClose>
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Add Student' : 'Save Changes'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
