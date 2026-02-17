'use client';

import {
    MoreVertical,
    School,
    Edit,
    Eye,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GovtOrg } from '@/data/users';

interface GovtTableProps {
    orgs: GovtOrg[];
    onView: (org: GovtOrg) => void;
    onEdit: (org: GovtOrg) => void;
    onDelete: (org: GovtOrg) => void;
}

export function GovtTable({ orgs, onView, onEdit, onDelete }: GovtTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Region/Department</TableHead>
                        <TableHead>Assigned Schools</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orgs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No organizations found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orgs.map((org) => (
                            <TableRow
                                key={org.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={(e) => {
                                    if ((e.target as any).closest('.action-btn')) return;
                                    onView(org);
                                }}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 bg-primary/10">
                                            <AvatarFallback className="text-primary">{org.organizationName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{org.organizationName}</span>
                                            <span className="text-xs text-muted-foreground">ID: {org.id}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{org.name}</span>
                                        <span className="text-xs text-muted-foreground">{org.designation}</span>
                                        <span className="text-xs text-muted-foreground">{org.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm">{org.state}</span>
                                        <span className="text-xs text-muted-foreground">{org.department}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 font-medium">
                                        <School className="h-3 w-3 text-muted-foreground" />
                                        {org.assignedSchools?.length || 0} Schools
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={org.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                        {org.status}
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
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(org.id)}>
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onView(org)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(org)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <School className="mr-2 h-4 w-4" /> Manage Schools
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(org)} className="text-destructive focus:text-destructive">
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
    );
}
