'use client';

import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Teacher } from '@/data/users';

interface TeacherFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Teacher> | null;
    mode: 'add' | 'edit';
    onSubmit: (data: any) => void;
}

export function TeacherFormSheet({ open, onOpenChange, initialData, mode, onSubmit }: TeacherFormSheetProps) {
    const defaultForm = {
        name: '',
        email: '',
        specialization: '',
        qualifications: '',
        experience: 0,
        phone: '',
        status: 'active',
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    specialization: initialData.specialization || '',
                    qualifications: initialData.qualifications || '',
                    experience: initialData.experience || 0,
                    phone: initialData.phone || '',
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
                    <SheetTitle>{mode === 'add' ? 'Add New Teacher' : 'Edit Teacher Details'}</SheetTitle>
                    {mode === 'add' && (
                        <SheetDescription>Register a new instructor to the platform.</SheetDescription>
                    )}
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
                    <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input id="specialization" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g. Robotics, AI" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications</Label>
                        <Input id="qualifications" value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} placeholder="e.g. M.Tech, PhD" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience (Years)</Label>
                            <Input id="experience" type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>
                    {mode === 'edit' && (
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Save Teacher' : 'Save Changes'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
