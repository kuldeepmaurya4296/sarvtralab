'use client';

import { useEffect, useState } from 'react';
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SchoolStudentFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'add' | 'edit';
    initialData?: any;
    onSubmit: (data: any) => void;
}

export function SchoolStudentFormSheet({ open, onOpenChange, mode, initialData, onSubmit }: SchoolStudentFormSheetProps) {
    const defaultForm = {
        name: '', email: '', grade: '', parentName: '', parentPhone: '', status: 'active',
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    grade: initialData.grade || '',
                    parentName: initialData.parentName || '',
                    parentPhone: initialData.parentPhone || '',
                    status: initialData.status || 'active',
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
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{mode === 'add' ? 'Enroll New Student' : 'Edit Student Details'}</SheetTitle>
                    <SheetDescription>
                        {mode === 'add' ? 'Add a new student to your school registry.' : 'Update personal or academic information.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade/Class</Label>
                            <Select value={formData.grade} onValueChange={(val) => setFormData({ ...formData, grade: val })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="p-name">Parent Name</Label>
                        <Input id="p-name" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-phone">Parent Phone</Label>
                        <Input id="p-phone" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Enroll Student' : 'Save Changes'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
