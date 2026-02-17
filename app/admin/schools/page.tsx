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
    Building
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
import { Label } from '@/components/ui/label';

export default function AdminSchoolsPage() {
    const admin = mockSuperAdmin;
    const allSchools = mockSchools;

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');

    // Filter logic
    const filteredSchools = allSchools.filter(school => {
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
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                        <Dialog>
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
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input id="name" placeholder="School Name" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="code" className="text-right">
                                            Code
                                        </Label>
                                        <Input id="code" placeholder="Unique Code" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="city" className="text-right">
                                            City
                                        </Label>
                                        <Input id="city" placeholder="City" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create School</Button>
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
                            Displaying {filteredSchools.length} of {allSchools.length} registered schools
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
                                            <TableRow key={school.id}>
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
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school.id)}>
                                                                Copy School ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                            <DropdownMenuItem>Manage Access</DropdownMenuItem>
                                                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                Deactivate School
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
        </DashboardLayout>
    );
}
