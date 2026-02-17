'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Plus,
    School as SchoolIcon,
    MapPin,
    GraduationCap,
    MoreVertical,
    Building,
    Trash2,
    Edit,
    Eye,
    FileText,
    BarChart3,
    Lock,
    Key,
    Mail,
    Users,
    BookOpen,
    Shield,
    Phone,
    Globe,
    Calendar,
    CreditCard,
    Info
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockSchools } from '@/data/users';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function AdminSchoolsPage() {
    const admin = mockSuperAdmin;

    const [schools, setSchools] = useState(mockSchools);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');

    // Action states
    const [selectedSchool, setSelectedSchool] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAccessOpen, setIsAccessOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [accessData, setAccessData] = useState({
        adminEmail: '',
        newPassword: '',
        isLocked: false
    });

    const [formData, setFormData] = useState({
        name: '',
        schoolCode: '',
        city: '',
        state: '',
        schoolType: 'private',
        board: 'CBSE',
        subscriptionPlan: 'basic'
    });

    // Filter logic
    const filteredSchools = schools.filter(school => {
        const matchesSearch =
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.schoolCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.principalName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || school.schoolType === typeFilter;
        const matchesBoard = boardFilter === 'all' || school.board === boardFilter;
        const matchesPlan = planFilter === 'all' || school.subscriptionPlan === planFilter;

        return matchesSearch && matchesType && matchesBoard && matchesPlan;
    });

    const getStatusColor = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return "destructive"; // Expired
        if (daysLeft < 30) return "warning"; // Expiring soon
        return "success"; // Active
    };

    const getStatusLabel = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        if (expiry < today) return "Expired";
        return "Active";
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Code', 'City', 'Type', 'Board', 'Students', 'Plan'];
        const csvContent = [
            headers.join(','),
            ...schools.map(s => [
                s.id,
                `"${s.name}"`,
                s.schoolCode,
                `"${s.city}"`,
                s.schoolType,
                s.board,
                s.totalStudents,
                s.subscriptionPlan
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schools-export.csv';
        a.click();
        toast.success("Exported school data");
    };

    const handleAddSchool = () => {
        const newSchool = {
            id: `SCH-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            principalName: 'John Doe', // Default
            phone: '123-456-7890',
            email: 'admin@school.com',
            address: '123 School Lane',
            totalStudents: 0,
            totalTeachers: 0,
            subscriptionStatus: 'active',
            subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            logo: '',
            establishedYear: 2024
        };
        // @ts-ignore
        setSchools([newSchool, ...schools]);
        setIsAddOpen(false);
        setFormData({ name: '', schoolCode: '', city: '', state: '', schoolType: 'private', board: 'CBSE', subscriptionPlan: 'basic' });
        toast.success("School created successfully");
    };

    const handleEditSave = () => {
        if (!selectedSchool) return;
        setSchools(schools.map(s =>
            s.id === selectedSchool.id ? {
                ...s,
                ...formData,
                schoolType: formData.schoolType as 'government' | 'private' | 'aided',
                board: formData.board as 'CBSE' | 'ICSE' | 'State Board',
                subscriptionPlan: formData.subscriptionPlan as 'basic' | 'standard' | 'premium'
            } : s
        ));
        setIsEditOpen(false);
        toast.success("School details updated");
    };

    // Open handlers
    const openEdit = (school: any) => {
        setSelectedSchool(school);
        setFormData({
            name: school.name,
            schoolCode: school.schoolCode,
            city: school.city,
            state: school.state,
            schoolType: school.schoolType,
            board: school.board,
            subscriptionPlan: school.subscriptionPlan
        });
        setIsEditOpen(true);
    };

    const openAccess = (school: any) => {
        setSelectedSchool(school);
        setAccessData({
            adminEmail: school.email || 'admin@school.com',
            newPassword: '',
            isLocked: false
        });
        setIsAccessOpen(true);
    };

    const openAnalytics = (school: any) => {
        setSelectedSchool(school);
        setIsAnalyticsOpen(true);
    };

    const openDelete = (school: any) => {
        setSelectedSchool(school);
        setIsDeleteOpen(true);
    };

    const openDetails = (school: any) => {
        setSelectedSchool(school);
        setIsDetailsOpen(true);
    };

    // Submit handlers
    const handleSaveAccess = () => {
        setIsAccessOpen(false);
        toast.success("Access settings updated");
    };

    const handleDelete = () => {
        if (!selectedSchool) return;
        setSchools(schools.filter(s => s.id !== selectedSchool.id));
        setIsDeleteOpen(false);
        toast.success("School deactivated/deleted");
    };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <SchoolIcon className="h-6 w-6 text-primary" />
                            Manage Schools
                        </h1>
                        <p className="text-muted-foreground">
                            Overview and management of all registered schools
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Plus className="h-4 w-4" />
                                    Add New School
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New School</DialogTitle>
                                    <DialogDescription>
                                        Register a new school to the platform.
                                    </DialogDescription>
                                </DialogHeader>
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
                                        <Label htmlFor="code" className="text-right">Code</Label>
                                        <Input
                                            id="code"
                                            value={formData.schoolCode}
                                            onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="city" className="text-right">City</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">Type</Label>
                                        <Select
                                            value={formData.schoolType}
                                            onValueChange={(val) => setFormData({ ...formData, schoolType: val })}
                                        >
                                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="private">Private</SelectItem>
                                                <SelectItem value="government">Government</SelectItem>
                                                <SelectItem value="aided">Aided</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddSchool}>Create School</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>School Directory</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="government">Government</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="aided">Aided</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={boardFilter} onValueChange={setBoardFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Board" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Boards</SelectItem>
                                        <SelectItem value="CBSE">CBSE</SelectItem>
                                        <SelectItem value="ICSE">ICSE</SelectItem>
                                        <SelectItem value="State Board">State Board</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={planFilter} onValueChange={setPlanFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Plans</SelectItem>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Displaying {filteredSchools.length} of {schools.length} registered schools
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School Name & Code</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Principal / Contact</TableHead>
                                        <TableHead>Type / Board</TableHead>
                                        <TableHead>Stats</TableHead>
                                        <TableHead>Subscription</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSchools.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No schools found matching your filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSchools.map((school) => (
                                            <TableRow key={school.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    if ((e.target as any).closest('.action-btn')) return;
                                                    openDetails(school);
                                                }}
                                            >
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{school.name}</span>
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {school.schoolCode}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="text-sm">{school.city}, {school.state}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{school.principalName}</span>
                                                        <span className="text-xs text-muted-foreground">{school.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline" className="w-fit text-[10px] h-5">
                                                                {school.schoolType}
                                                            </Badge>
                                                            <Badge variant="outline" className="w-fit text-[10px] h-5">
                                                                {school.board}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium flex items-center gap-1">
                                                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                                                        {school.totalStudents.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="secondary" className="w-fit capitalize">
                                                            {school.subscriptionPlan}
                                                        </Badge>
                                                        <span className={`text-[10px] font-medium ${getStatusColor(school.subscriptionExpiry) === 'destructive' ? 'text-red-600' :
                                                            getStatusColor(school.subscriptionExpiry) === 'warning' ? 'text-amber-600' : 'text-green-600'
                                                            }`}>
                                                            {getStatusLabel(school.subscriptionExpiry)}
                                                        </span>
                                                    </div>
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
                                                            <DropdownMenuItem onClick={() => openDetails(school)}>
                                                                <Info className="mr-2 h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school.id)}>
                                                                Copy School ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => openEdit(school)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openAccess(school)}>
                                                                <Building className="mr-2 h-4 w-4" /> Manage Access
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openAnalytics(school)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Analytics
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => openDelete(school)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Deactivate School
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

            {/* Edit School Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Edit School Details</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">School Name</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">School Code</Label>
                            <Input id="edit-code" value={formData.schoolCode} onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-city">City</Label>
                            <Input id="edit-city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-state">State</Label>
                            <Input id="edit-state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-type">School Type</Label>
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
                            <Label htmlFor="edit-board">Board</Label>
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
                            <Label htmlFor="edit-plan">Subscription Plan</Label>
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
                        <Button onClick={handleEditSave}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Manage Access Dialog */}
            <Dialog open={isAccessOpen} onOpenChange={setIsAccessOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage School Access</DialogTitle>
                        <DialogDescription>
                            Update login credentials and access permissions for {selectedSchool?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Admin Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="admin-email"
                                    className="pl-8"
                                    value={accessData.adminEmail}
                                    onChange={(e) => setAccessData({ ...accessData, adminEmail: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-pass">New Password</Label>
                            <div className="relative">
                                <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="admin-pass"
                                    type="password"
                                    className="pl-8"
                                    placeholder="Leave blank to keep current"
                                    value={accessData.newPassword}
                                    onChange={(e) => setAccessData({ ...accessData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Lock Account</p>
                                <p className="text-xs text-muted-foreground">Temporarily disable access for this school</p>
                            </div>
                            <Switch
                                checked={accessData.isLocked}
                                onCheckedChange={(checked) => setAccessData({ ...accessData, isLocked: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveAccess}>Update Credentials</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Analytics Sheet */}
            <Sheet open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>School Analytics</SheetTitle>
                        <SheetDescription>
                            Performance overview for {selectedSchool?.name}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedSchool && (
                        <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Users className="h-8 w-8 text-blue-500 mb-2" />
                                        <h3 className="text-2xl font-bold">{selectedSchool.totalStudents}</h3>
                                        <p className="text-xs text-muted-foreground">Total Students</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <BookOpen className="h-8 w-8 text-green-500 mb-2" />
                                        <h3 className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}</h3>
                                        <p className="text-xs text-muted-foreground">Active Courses</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Shield className="h-8 w-8 text-purple-500 mb-2" />
                                        <h3 className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 10}</h3>
                                        <p className="text-xs text-muted-foreground">Teachers</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <BarChart3 className="h-8 w-8 text-orange-500 mb-2" />
                                        <h3 className="text-2xl font-bold">94%</h3>
                                        <p className="text-xs text-muted-foreground">Attendance Rate</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Storage Usage</h3>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%]"></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>65 GB Used</span>
                                    <span>100 GB Total</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm">Recent Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm">
                                            <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                            <div>
                                                <p className="font-medium">New student registration batch</p>
                                                <p className="text-xs text-muted-foreground">2 hours ago • Admin Panel</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* School Details Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>School Details</SheetTitle>
                        <SheetDescription>
                            Comprehensive information for {selectedSchool?.name}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedSchool && (
                        <div className="space-y-6 mt-6">
                            {/* Header Info */}
                            <div className="flex items-start gap-4">
                                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <SchoolIcon className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedSchool.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <Badge variant="outline">{selectedSchool.schoolCode}</Badge>
                                        <Badge variant="secondary" className="capitalize">{selectedSchool.schoolType}</Badge>
                                        <Badge variant="outline">{selectedSchool.board}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        Contact Information
                                    </h4>
                                    <div className="text-sm space-y-2 pl-6">
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">Principal:</span>
                                            <span className="font-medium">{selectedSchool.principalName}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span className="font-medium">{selectedSchool.phone}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span className="font-medium break-all">{selectedSchool.email}</span>
                                        </div>
                                        {selectedSchool.websiteUrl && (
                                            <div className="grid grid-cols-[80px_1fr] gap-1">
                                                <span className="text-muted-foreground">Website:</span>
                                                <a href={selectedSchool.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate">
                                                    {selectedSchool.websiteUrl}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location Info */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Location
                                    </h4>
                                    <div className="text-sm space-y-2 pl-6">
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">Address:</span>
                                            <span className="font-medium">{selectedSchool.address}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">City:</span>
                                            <span className="font-medium">{selectedSchool.city}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">State:</span>
                                            <span className="font-medium">{selectedSchool.state}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-1">
                                            <span className="text-muted-foreground">Pincode:</span>
                                            <span className="font-medium">{selectedSchool.pincode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Users className="h-6 w-6 text-blue-500 mb-1" />
                                        <span className="text-lg font-bold">{selectedSchool.totalStudents}</span>
                                        <span className="text-[10px] text-muted-foreground">Students</span>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Shield className="h-6 w-6 text-purple-500 mb-1" />
                                        <span className="text-lg font-bold">{Math.floor(selectedSchool.totalStudents / 30)}</span> {/* Mock teacher count */}
                                        <span className="text-[10px] text-muted-foreground">Teachers</span>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <BookOpen className="h-6 w-6 text-green-500 mb-1" />
                                        <span className="text-lg font-bold">{selectedSchool.assignedCourses?.length || 0}</span>
                                        <span className="text-[10px] text-muted-foreground">Courses</span>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Calendar className="h-6 w-6 text-orange-500 mb-1" />
                                        <span className="text-lg font-bold">{new Date().getFullYear() - (selectedSchool.establishedYear || 2020)}</span>
                                        <span className="text-[10px] text-muted-foreground">Years Active</span>
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator />

                            {/* Subscription Info */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Subscription & Billing
                                </h4>
                                <div className="bg-muted/30 p-4 rounded-md text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Current Plan</span>
                                        <Badge variant="default" className="mt-1 capitalize">{selectedSchool.subscriptionPlan}</Badge>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Status</span>
                                        <span className={`font-medium mt-1 inline-flex items-center gap-1 ${getStatusColor(selectedSchool.subscriptionExpiry) === 'destructive' ? 'text-red-600' :
                                                getStatusColor(selectedSchool.subscriptionExpiry) === 'warning' ? 'text-amber-600' : 'text-green-600'
                                            }`}>
                                            <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedSchool.subscriptionExpiry) === 'destructive' ? 'bg-red-600' :
                                                    getStatusColor(selectedSchool.subscriptionExpiry) === 'warning' ? 'bg-amber-600' : 'bg-green-600'
                                                }`}></span>
                                            {getStatusLabel(selectedSchool.subscriptionExpiry)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Expires On</span>
                                        <span className="font-medium block mt-1">{new Date(selectedSchool.subscriptionExpiry).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">School ID</span>
                                        <span className="font-mono text-xs block mt-1">{selectedSchool.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="pt-4 flex flex-wrap gap-2">
                                <Button className="flex-1" onClick={() => openEdit(selectedSchool)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => openAccess(selectedSchool)}>
                                    <Lock className="mr-2 h-4 w-4" /> Access
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => openAnalytics(selectedSchool)}>
                                    <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => openDelete(selectedSchool)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate the school.
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
