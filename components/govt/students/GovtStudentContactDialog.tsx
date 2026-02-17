'use client';

import { User, Phone, Mail } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface GovtStudentContactDialogProps {
    student: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GovtStudentContactDialog({ student, open, onOpenChange }: GovtStudentContactDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact Parent/Guardian</DialogTitle>
                    <DialogDescription>
                        Contact details for {student?.name}&apos;s parent.
                    </DialogDescription>
                </DialogHeader>
                {student && (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-3 p-3 border rounded-md">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Guardian Name</p>
                                <p className="text-sm text-muted-foreground">{student.parentName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-md">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Phone Number</p>
                                <p className="text-sm text-muted-foreground">{student.parentPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-md">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-sm text-muted-foreground">{student.parentEmail || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
