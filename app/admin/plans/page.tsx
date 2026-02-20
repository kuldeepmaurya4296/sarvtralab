'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Search, Plus, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Actions
import { getAdminPlans, createPlan, updatePlan, deletePlan } from '@/lib/actions/plan.actions';

// Components
import { PlanCardGrid } from '@/components/admin/plans/PlanCardGrid';
import { PlanFormSheet } from '@/components/admin/plans/PlanFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminPlansPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [planList, setPlanList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI States
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchPlans = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const plans = await getAdminPlans();
                    setPlanList(plans);
                } catch (error) {
                    toast.error("Failed to load plans");
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) fetchPlans();
    }, [user, isAuthLoading]);

    const filteredPlans = planList.filter(plan =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleAddPlan = async (formData: any) => {
        try {
            const created = await createPlan(formData);
            if (created) {
                setPlanList([created, ...planList]);
                toast.success("New subscription plan created");
                setIsAddOpen(false);
            }
        } catch (error) {
            toast.error("Failed to create plan");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedPlan) return;
        try {
            const updated = await updatePlan(selectedPlan.id, formData);
            if (updated) {
                setPlanList(planList.map(p => p.id === selectedPlan.id ? updated : p));
                toast.success("Plan updated successfully");
                setIsEditOpen(false);
            }
        } catch (error) {
            toast.error("Failed to update plan");
        }
    };

    const handleDelete = async () => {
        if (!selectedPlan) return;
        try {
            const success = await deletePlan(selectedPlan.id);
            if (success) {
                setPlanList(planList.filter(p => p.id !== selectedPlan.id));
                setIsDeleteOpen(false);
                toast.success("Plan removed from the system");
            }
        } catch (error) {
            toast.error("Failed to delete plan");
        }
    };

    // Open handlers
    const openEdit = (plan: any) => { setSelectedPlan(plan); setIsEditOpen(true); };
    const openDelete = (plan: any) => { setSelectedPlan(plan); setIsDeleteOpen(true); };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    return (
        <DashboardLayout role="admin" userName={user.name} userEmail={user.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <CreditCard className="h-6 w-6 text-primary" />
                            Plan Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage subscription plans for partner schools
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" asChild>
                            <Link href="/schools" target="_blank">
                                View Public Page
                                <ExternalLink className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setIsAddOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Create New Plan
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search plans..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredPlans.length} plans
                    </div>
                </div>

                <PlanCardGrid
                    plans={filteredPlans}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />
            </div>

            <PlanFormSheet
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                mode="add"
                onSubmit={handleAddPlan}
            />

            <PlanFormSheet
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                mode="edit"
                initialData={selectedPlan}
                onSubmit={handleEditSave}
            />

            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDelete}
                title="Delete this plan?"
                description={<>Are you sure you want to delete <strong>{selectedPlan?.name}</strong>? This will remove it from the public schools page.</>}
                confirmLabel="Delete Plan"
            />
        </DashboardLayout>
    );
}
