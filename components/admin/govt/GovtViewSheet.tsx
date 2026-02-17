'use client';

import {
    Building,
    MapPin,
    School,
    Globe,
    Briefcase,
    Edit,
    Trash2,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { GovtOrg } from '@/data/users';

interface GovtViewSheetProps {
    org: GovtOrg | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (org: GovtOrg) => void;
    onDelete: (org: GovtOrg) => void;
}

export function GovtViewSheet({ org, open, onOpenChange, onEdit, onDelete }: GovtViewSheetProps) {
    if (!org) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Organization Profile</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-20 w-20 border-2 border-primary/10">
                            <AvatarFallback className="text-2xl text-primary font-bold">
                                {org.organizationName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold">{org.organizationName}</h3>
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Building className="h-3.5 w-3.5" />
                                    {org.department}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {org.state || 'N/A'}
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={org.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                        {org.status}
                                    </Badge>
                                    <Badge variant="outline" className="capitalize">{org.organizationType?.replace('_', ' ') || 'Government'}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                Primary Contact
                            </h4>
                            <div className="bg-muted/30 p-4 rounded-lg border text-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{org.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{org.name}</p>
                                        <p className="text-xs text-muted-foreground">{org.designation}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Email</span>
                                        <span className="font-medium text-xs sm:text-sm">{org.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Phone</span>
                                        <span className="font-medium text-xs sm:text-sm">{(org as any).phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                Jurisdiction & Reach
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-md p-3">
                                    <span className="text-muted-foreground text-xs block">Jurisdiction Level</span>
                                    <span className="font-medium text-sm block capitalize mt-1">{org.jurisdiction || 'State'}</span>
                                </div>
                                <div className="border rounded-md p-3">
                                    <span className="text-muted-foreground text-xs block">Assigned Schools</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <School className="h-4 w-4 text-primary" />
                                        <span className="font-bold text-lg">{org.assignedSchools?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="pt-4 flex gap-2 flex-wrap">
                        <Button className="flex-1" onClick={() => { onOpenChange(false); onEdit(org); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <School className="mr-2 h-4 w-4" /> Manage Schools
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => { onOpenChange(false); onDelete(org); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
