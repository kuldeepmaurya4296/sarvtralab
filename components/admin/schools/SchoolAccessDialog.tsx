'use client';

import { useState } from 'react';
import { Mail, Key, Lock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { School } from '@/data/users';

interface SchoolAccessDialogProps {
    school: School | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: { adminEmail: string; newPassword: string; isLocked: boolean }) => void;
}

export function SchoolAccessDialog({ school, open, onOpenChange, onSave }: SchoolAccessDialogProps) {
    const [accessData, setAccessData] = useState({
        adminEmail: school?.email || 'admin@school.com',
        newPassword: '',
        isLocked: false
    });

    const handleSave = () => {
        onSave(accessData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage School Access</DialogTitle>
                    <DialogDescription>
                        Update login credentials and access permissions for {school?.name}.
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
                    <Button onClick={handleSave}>Update Credentials</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
