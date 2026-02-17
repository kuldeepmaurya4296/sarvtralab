'use client';

import {
    MapPin,
    GraduationCap,
    MoreVertical,
    Info,
    Edit,
    Eye,
    Building,
    Trash2,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { School } from '@/data/users';

interface SchoolTableProps {
    schools: School[];
    onView: (school: School) => void;
    onEdit: (school: School) => void;
    onDelete: (school: School) => void;
    onAccess: (school: School) => void;
    onAnalytics: (school: School) => void;
}

function getStatusColor(expiryDate: string) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return "destructive";
    if (daysLeft < 30) return "warning";
    return "success";
}

function getStatusLabel(expiryDate: string) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) return "Expired";
    return "Active";
}

export function SchoolTable({ schools, onView, onEdit, onDelete, onAccess, onAnalytics }: SchoolTableProps) {
    return (
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
                    {schools.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No schools found matching your filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        schools.map((school) => (
                            <TableRow key={school.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={(e) => {
                                    if ((e.target as any).closest('.action-btn')) return;
                                    onView(school);
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
                                            <DropdownMenuItem onClick={() => onView(school)}>
                                                <Info className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school.id)}>
                                                Copy School ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onEdit(school)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onAccess(school)}>
                                                <Building className="mr-2 h-4 w-4" /> Manage Access
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onAnalytics(school)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Analytics
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => onDelete(school)}
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
    );
}
