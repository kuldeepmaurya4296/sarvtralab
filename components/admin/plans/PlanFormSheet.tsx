'use client';

import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlanFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'add' | 'edit';
    initialData?: any;
    onSubmit: (data: any) => void;
}

export function PlanFormSheet({ open, onOpenChange, mode, initialData, onSubmit }: PlanFormSheetProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        period: '',
        features: [] as string[],
        popular: false,
        status: 'active' as 'active' | 'inactive'
    });

    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                period: initialData.period || '',
                features: initialData.features || [],
                popular: initialData.popular || false,
                status: initialData.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                period: '',
                features: [],
                popular: false,
                status: 'active'
            });
        }
    }, [mode, initialData, open]);

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{mode === 'add' ? 'Create New Plan' : 'Edit Subscription Plan'}</SheetTitle>
                    <SheetDescription>
                        {mode === 'add'
                            ? 'Set up a new subscription tier for schools.'
                            : 'Update the details for the school subscription plan.'}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Premium Plan"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Briefly describe what this plan offers..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="e.g. ₹99,999"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="period">Period</Label>
                                <Input
                                    id="period"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    placeholder="e.g. /year"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                            <div className="space-y-0.5">
                                <Label htmlFor="popular">Featured Plan</Label>
                                <p className="text-xs text-muted-foreground">Display a "Most Popular" badge on this plan</p>
                            </div>
                            <Switch
                                id="popular"
                                checked={formData.popular}
                                onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Plan Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: 'active' | 'inactive') => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active (Visible)</SelectItem>
                                    <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Features</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Add a plan feature..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                />
                                <Button type="button" size="icon" onClick={addFeature}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                                {formData.features.length === 0 ? (
                                    <p className="text-sm text-center text-muted-foreground py-4">No features added yet</p>
                                ) : (
                                    formData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md group">
                                            <span className="text-sm">{feature}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeFeature(index)}
                                            >
                                                <X className="h-3 w-3 text-destructive" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <SheetFooter>
                        <Button type="submit" className="w-full">
                            {mode === 'add' ? 'Create Plan' : 'Update Plan'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
