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
import { GovtOrg } from '@/data/users';

interface GovtFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<GovtOrg> | null;
    mode: 'add' | 'edit';
    onSubmit: (data: any) => void;
}

export function GovtFormSheet({ open, onOpenChange, initialData, mode, onSubmit }: GovtFormSheetProps) {
    const defaultForm = {
        organizationName: '',
        name: '',
        email: '',
        designation: '',
        department: '',
        state: '',
        status: 'active',
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    organizationName: initialData.organizationName || '',
                    name: initialData.name || '',
                    email: initialData.email || '',
                    designation: initialData.designation || '',
                    department: initialData.department || '',
                    state: initialData.state || '',
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
                    <SheetTitle>{mode === 'add' ? 'Add Government Organization' : 'Edit Organization Details'}</SheetTitle>
                    {mode === 'add' && (
                        <SheetDescription>Register a new government partner or department.</SheetDescription>
                    )}
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} placeholder="e.g. Ministry of Education" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Contact Person</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Official Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input id="designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dept">Department</Label>
                            <Input id="dept" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State/Region</Label>
                        <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
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
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Save Organization' : 'Save Changes'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
