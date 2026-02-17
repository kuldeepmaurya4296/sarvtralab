'use client';

import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
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
import { School } from '@/data/users';

interface SchoolFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<School> | null;
    mode: 'add' | 'edit';
    onSubmit: (data: any) => void;
}

export function SchoolFormSheet({ open, onOpenChange, initialData, mode, onSubmit }: SchoolFormSheetProps) {
    const defaultForm = {
        name: '',
        schoolCode: '',
        city: '',
        state: '',
        schoolType: 'private',
        board: 'CBSE',
        subscriptionPlan: 'basic'
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    schoolCode: initialData.schoolCode || '',
                    city: initialData.city || '',
                    state: initialData.state || '',
                    schoolType: initialData.schoolType || 'private',
                    board: initialData.board || 'CBSE',
                    subscriptionPlan: initialData.subscriptionPlan || 'basic'
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
                    <SheetTitle>{mode === 'add' ? 'Add New School' : 'Edit School Details'}</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">School Name</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">School Code</Label>
                        <Input id="code" value={formData.schoolCode} onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>School Type</Label>
                        <Select value={formData.schoolType} onValueChange={(val) => setFormData({ ...formData, schoolType: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="aided">Aided</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Board</Label>
                        <Select value={formData.board} onValueChange={(val) => setFormData({ ...formData, board: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CBSE">CBSE</SelectItem>
                                <SelectItem value="ICSE">ICSE</SelectItem>
                                <SelectItem value="State Board">State Board</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Subscription Plan</Label>
                        <Select value={formData.subscriptionPlan} onValueChange={(val) => setFormData({ ...formData, subscriptionPlan: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Create School' : 'Save Changes'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
