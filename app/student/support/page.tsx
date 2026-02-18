'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockStudents } from '@/data/users';
import { organizationDetails } from '@/data/organization';
import { Mail, Phone, Clock, Construction, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationContext';
import { toast } from 'sonner';

export default function StudentSupportPage() {
    const student = mockStudents.find(s => s.id === 'std-001');
    const { notifyAdmin, addNotification } = useNotifications();

    if (!student) return <div>Loading...</div>;

    const handleCreateTicket = () => {
        toast.success("Support ticket created!");
        addNotification(
            'Support Ticket Submitted',
            'Your ticket #T-102 has been received and is being reviewed.',
            'success'
        );
        notifyAdmin(
            'New Support Ticket',
            `${student.name} has submitted a new support ticket.`,
            'warning',
            '/admin/help-support'
        );
    };

    return (
        <DashboardLayout role="student" userName={student.name} userEmail={student.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
                        <p className="text-muted-foreground">Need assistance? Here's how you can reach us.</p>
                    </div>
                    <Button onClick={handleCreateTicket} className="gap-2">
                        <LifeBuoy className="w-4 h-4" />
                        Create Support Ticket
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Contact Cards */}
                    <div className="bg-card p-6 rounded-2xl border shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Get help with account issues, course content, or technical problems.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href={`mailto:${organizationDetails.contact.email}`}>Send Email</a>
                        </Button>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border shadow-sm">
                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Speak directly with our support team during business hours.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href={`tel:${organizationDetails.contact.phone}`}>{organizationDetails.contact.phone}</a>
                        </Button>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border shadow-sm">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Support Hours</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Our team is available to assist you during the following times:
                        </p>
                        <p className="font-medium text-foreground">{organizationDetails.contact.hours}</p>
                    </div>
                </div>

                {/* FAQ Section Placeholder */}
                <div className="mt-12 text-center py-12 border-t">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Construction className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Knowledge Base Coming Soon</h3>
                    <p className="text-muted-foreground mt-2">
                        We are building a searchable FAQ and help center to answer your questions instantly.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
