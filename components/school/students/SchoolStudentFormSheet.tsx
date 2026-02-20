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
import { Student } from '@/data/users';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUniqueGrades } from '@/lib/actions/student.actions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SchoolStudentFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'add' | 'edit';
    initialData?: Student | null;
    onSubmit: (data: any) => void;
}

export function SchoolStudentFormSheet({ open, onOpenChange, mode, initialData, onSubmit }: SchoolStudentFormSheetProps) {
    const { user } = useAuth();
    const [grades, setGrades] = useState<string[]>(['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']);
    const [newGrade, setNewGrade] = useState('');
    const [gradeOpen, setGradeOpen] = useState(false);

    const defaultForm = {
        name: '', email: '', password: '', grade: '', parentName: '', parentPhone: '', status: 'active',
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        const loadGrades = async () => {
            if (user?.id) {
                const fetchedGrades = await getUniqueGrades(user.id);
                if (fetchedGrades.length > 0) {
                    const unique = Array.from(new Set([...['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], ...fetchedGrades])).sort();
                    setGrades(unique);
                }
            }
        };
        if (open) loadGrades();
    }, [open, user?.id]);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    password: '', // Usually keep same if empty
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

    const handleAddNewGrade = () => {
        if (!newGrade.trim()) return;
        const normalizedGrade = newGrade.trim();
        if (!grades.includes(normalizedGrade)) {
            setGrades(prev => [...prev, normalizedGrade].sort());
        }
        setFormData({ ...formData, grade: normalizedGrade });
        setNewGrade('');
        setGradeOpen(false);
        toast.success(`Grade "${normalizedGrade}" added to list`);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email || (mode === 'add' && !formData.password)) {
            toast.error("Please fill in required fields: Name, Email, and Password");
            return;
        }
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{mode === 'add' ? 'Enroll New Student' : 'Edit Student Details'}</SheetTitle>
                    <SheetDescription>
                        {mode === 'add' ? 'Add a new student to your school registry. Email and Password are required.' : 'Update personal or academic information.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex justify-between items-center">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex justify-between items-center">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input id="email" type="email" placeholder="student@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            {mode === 'add' ? (
                                <span className="flex justify-between items-center w-full">
                                    Set Password <span className="text-red-500">*</span>
                                </span>
                            ) : (
                                "Update Password (leave blank to keep current)"
                            )}
                        </Label>
                        <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Grade/Class</Label>
                            <Popover open={gradeOpen} onOpenChange={setGradeOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={gradeOpen}
                                        className="w-full justify-between"
                                    >
                                        {formData.grade || "Select Grade..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search grade..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                <div className="p-2 space-y-2">
                                                    <p className="text-xs text-muted-foreground">Grade not found.</p>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Add new grade"
                                                            className="h-8 text-xs"
                                                            value={newGrade}
                                                            onChange={(e) => setNewGrade(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleAddNewGrade();
                                                            }}
                                                        />
                                                        <Button size="sm" className="h-8 px-2" onClick={handleAddNewGrade}>
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {grades.map((grade) => (
                                                    <CommandItem
                                                        key={grade}
                                                        value={grade}
                                                        onSelect={(currentValue) => {
                                                            setFormData({ ...formData, grade: currentValue });
                                                            setGradeOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.grade === grade ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {grade}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
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
                        <Input id="p-name" placeholder="Parent/Guardian Name" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-phone">Parent Phone</Label>
                        <Input id="p-phone" placeholder="+91 00000 00000" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit} className="w-full">
                        {mode === 'add' ? 'Enroll Student' : 'Save Changes'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
