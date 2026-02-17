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
import { Textarea } from "@/components/ui/textarea";
import { Course } from '@/data/courses';

interface CourseFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Course> | null;
    mode: 'add' | 'edit';
    onSubmit: (data: any) => void;
}

export function CourseFormSheet({ open, onOpenChange, initialData, mode, onSubmit }: CourseFormSheetProps) {
    const defaultForm = {
        title: '',
        description: '',
        grade: '',
        duration: '',
        sessions: 0,
        price: 0,
        category: 'foundation',
        level: 'Beginner',
        image: '/placeholder.svg'
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    title: initialData.title || '',
                    description: initialData.description || '',
                    grade: initialData.grade || '',
                    duration: initialData.duration || '',
                    sessions: initialData.sessions || 0,
                    price: initialData.price || 0,
                    category: initialData.category || 'foundation',
                    level: initialData.level || 'Beginner',
                    image: initialData.image || '/placeholder.svg'
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
            <SheetContent className="overflow-y-auto sm:max-w-[500px]">
                <SheetHeader>
                    <SheetTitle>{mode === 'add' ? 'Create New Course' : 'Edit Course Details'}</SheetTitle>
                    {mode === 'add' && (
                        <SheetDescription>Design a new robotic learning track.</SheetDescription>
                    )}
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea id="desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="grade">Target Grade</Label>
                            <Input id="grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} placeholder="e.g. Class 4-6" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 3 Months" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sessions">No. of Sessions</Label>
                            <Input id="sessions" type="number" value={formData.sessions} onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="foundation">Foundation</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Difficulty Level</Label>
                        <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Create Course' : 'Save Changes'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
