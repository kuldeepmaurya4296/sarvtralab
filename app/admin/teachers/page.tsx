'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    MoreVertical,
    GraduationCap,
    School,
    BookOpen,
    Trash2,
    Edit,
    Eye,
    Link,
    Mail,
    Phone,
    Award,
    Briefcase
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockTeachers, mockSchools } from '@/data/users';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from '@/components/ui/separator';

export default function AdminTeachersPage() {
    const admin = mockSuperAdmin;
    // const allTeachers = mockTeachers; // Replaced by state

    const [teachers, setTeachers] = useState(mockTeachers);
    const [searchQuery, setSearchQuery] = useState('');

    // Action States
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        qualifications: '',
        experience: 0,
        phone: '',
        status: 'active',
        assignedSchools: [] as string[]
    });

    const filteredTeachers = teachers.filter(teacher => {
        return teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddTeacher = () => {
        const newTeacher: any = {
            id: `TCH-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            password: 'password123', // Default password
            status: formData.status as 'active' | 'inactive',
            role: 'teacher' as const,
            assignedCourses: [],
            createdAt: new Date().toISOString()
        };
        setTeachers([newTeacher, ...teachers]);
        setIsAddOpen(false);
        resetForm();
        toast.success("Teacher added successfully");
    };

    const handleEditSave = () => {
        if (!selectedTeacher) return;
        setTeachers(teachers.map(t =>
            t.id === selectedTeacher.id ? { ...t, ...formData, status: formData.status as 'active' | 'inactive' } : t
        ));
        setIsEditOpen(false);
        toast.success("Teacher details updated");
    };

    const handleDelete = () => {
        if (!selectedTeacher) return;
        setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
        setIsDeleteOpen(false);
        toast.success("Teacher account deactivated");
    };

    const handleAssignSchools = () => {
        if (!selectedTeacher) return;
        setTeachers(teachers.map(t =>
            t.id === selectedTeacher.id ? { ...t, assignedSchools: formData.assignedSchools } : t
        ));
        setIsAssignOpen(false);
        toast.success("School assignments updated");
    };

    const openEdit = (teacher: any) => {
        setSelectedTeacher(teacher);
        setFormData({
            name: teacher.name,
            email: teacher.email,
            specialization: teacher.specialization,
            qualifications: teacher.qualifications,
            experience: teacher.experience,
            phone: teacher.phone,
            status: teacher.status,
            assignedSchools: teacher.assignedSchools
        });
        setIsEditOpen(true);
    };

    const openAssign = (teacher: any) => {
        setSelectedTeacher(teacher);
        setFormData({
            ...formData,
            assignedSchools: teacher.assignedSchools
        });
        setIsAssignOpen(true);
    };

    const openView = (teacher: any) => {
        setSelectedTeacher(teacher);
        setIsViewOpen(true);
    };

    const openDelete = (teacher: any) => {
        setSelectedTeacher(teacher);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            specialization: '',
            qualifications: '',
            experience: 0,
            phone: '',
            status: 'active',
            assignedSchools: []
        });
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'Specialization', 'Experience', 'Status'];
        const csvContent = [
            headers.join(','),
            ...teachers.map(t => [
                t.id,
                `"${t.name}"`,
                t.email,
                `"${t.specialization}"`,
                t.experience,
                t.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teachers-export.csv';
        a.click();
        toast.success("Exported teacher list");
    };

    const getSchoolNames = (schoolIds: string[]) => {
        return mockSchools
            .filter(s => schoolIds.includes(s.id))
            .map(s => s.name)
            .join(', ');
    };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Manage Teachers
                        </h1>
                        <p className="text-muted-foreground">
                            Global teacher registry and assignments
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <SheetTrigger asChild>
                                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetForm}>
                                    <Plus className="h-4 w-4" />
                                    Add Teacher
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Add New Teacher</SheetTitle>
                                    <SheetDescription>
                                        Register a new instructor to the platform.
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
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </SheetClose>
                                    <Button onClick={handleAddTeacher}>Save Teacher</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Registered Teachers</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search teachers..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredTeachers.length} of {teachers.length} qualified instructors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Specialization</TableHead>
                                        <TableHead>Experience</TableHead>
                                        <TableHead>Assigned Schools</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTeachers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No teachers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTeachers.map((teacher) => (
                                            <TableRow
                                                key={teacher.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    // Prevent open details when clicking actions
                                                    if ((e.target as any).closest('.action-btn')) return;
                                                    openView(teacher);
                                                }}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} alt={teacher.name} />
                                                            <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">{teacher.name}</span>
                                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{teacher.specialization}</span>
                                                        <span className="text-xs text-muted-foreground">{teacher.qualifications}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{teacher.experience} Years</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-muted-foreground text-sm max-w-[200px] truncate" title={getSchoolNames(teacher.assignedSchools)}>
                                                        <School className="h-3 w-3 inline mr-1" />
                                                        {getSchoolNames(teacher.assignedSchools) || 'None'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                        {teacher.status}
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
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(teacher.id)}>
                                                                Copy ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => openView(teacher)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(teacher)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openAssign(teacher)}>
                                                                <School className="mr-2 h-4 w-4" /> Assign Schools
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDelete(teacher)} className="text-destructive focus:text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Deactivate Account
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
                    </CardContent>
                </Card>
            </div>
            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Edit Teacher Details</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-specialization">Specialization</Label>
                            <Input id="edit-specialization" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-qualifications">Qualifications</Label>
                            <Input id="edit-qualifications" value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-experience">Experience (Years)</Label>
                                <Input id="edit-experience" type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input id="edit-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button onClick={handleEditSave}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* View Profile Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Teacher Profile</SheetTitle>
                        <SheetDescription>
                            Detailed professional profile for {selectedTeacher?.name}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedTeacher && (
                        <div className="space-y-6 mt-6">
                            {/* Header Info */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20 border-2 border-primary/10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTeacher.name}`} />
                                    <AvatarFallback>{selectedTeacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            {selectedTeacher.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5" />
                                            {selectedTeacher.phone || 'N/A'}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant={selectedTeacher.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                {selectedTeacher.status}
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
                                            <span className="font-medium text-primary">{selectedTeacher.specialization}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] gap-1">
                                            <span className="text-muted-foreground">Qualifications:</span>
                                            <span className="font-medium">{selectedTeacher.qualifications}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] gap-1">
                                            <span className="text-muted-foreground">Experience:</span>
                                            <span className="font-medium">{selectedTeacher.experience} Years</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] gap-1">
                                            <span className="text-muted-foreground">Teacher ID:</span>
                                            <span className="font-mono text-xs py-0.5">{selectedTeacher.id}</span>
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
                                        {selectedTeacher.assignedSchools && selectedTeacher.assignedSchools.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {mockSchools.filter(s => selectedTeacher.assignedSchools.includes(s.id)).map(school => (
                                                    <div key={school.id} className="flex items-center gap-2 text-sm bg-muted/40 p-2 rounded">
                                                        <School className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{school.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No schools assigned.</p>
                                        )}
                                        <Button variant="link" className="p-0 h-auto text-xs mt-2" onClick={() => { setIsViewOpen(false); openAssign(selectedTeacher); }}>
                                            + Manage Assignments
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Actions Footer */}
                            <div className="pt-4 flex flex-wrap gap-2">
                                <Button className="flex-1" onClick={() => { setIsViewOpen(false); openEdit(selectedTeacher); }}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => { setIsViewOpen(false); openAssign(selectedTeacher); }}>
                                    <School className="mr-2 h-4 w-4" /> Assign Schools
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => { setIsViewOpen(false); openDelete(selectedTeacher); }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Assign Schools Dialog */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Schools</DialogTitle>
                        <DialogDescription>
                            Select schools to assign to {selectedTeacher?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4 max-h-[300px] overflow-y-auto">
                        {mockSchools.map(school => (
                            <div key={school.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`school-${school.id}`}
                                    checked={formData.assignedSchools.includes(school.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setFormData({ ...formData, assignedSchools: [...formData.assignedSchools, school.id] });
                                        } else {
                                            setFormData({ ...formData, assignedSchools: formData.assignedSchools.filter(id => id !== school.id) });
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
                        <Button onClick={handleAssignSchools}>Save Assignments</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate the teacher's account and revoke their access to the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Deactivate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
