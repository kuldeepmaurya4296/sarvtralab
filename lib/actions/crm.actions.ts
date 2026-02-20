'use server';

import connectToDatabase from '@/lib/mongoose';
import Lead from '@/lib/models/Lead';
import { revalidatePath } from 'next/cache';
import { clean } from '@/lib/utils';

/**
 * Fetch leads with filtering, sorting, and pagination
 */
export async function getLeads(
    filters: Partial<any> = {},
    page: number = 1,
    limit: number = 10
) {
    try {
        await connectToDatabase();

        // Build query
        const query: any = {};
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { phone: { $regex: filters.search, $options: 'i' } }
            ];
        }
        if (filters.status && filters.status !== 'All') {
            query.status = filters.status;
        }
        if (filters.source) {
            query.source = filters.source;
        }

        const skip = (page - 1) * limit;

        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Lead.countDocuments(query);

        return {
            leads: clean(leads),
            total,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error("Error fetching leads:", error);
        throw new Error("Failed to fetch leads");
    }
}

/**
 * Create a new lead
 */
export async function createLead(data: any) {
    try {
        await connectToDatabase();

        // Check for existing lead by email
        const existing = await Lead.findOne({ email: data.email });
        if (existing) {
            throw new Error("Lead with this email already exists");
        }

        const newLead = await Lead.create(data);
        revalidatePath('/admin/crm');
        return clean(newLead);
    } catch (error: any) {
        console.error("Error creating lead:", error);
        throw new Error(error.message || "Failed to create lead");
    }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(id: string, status: string) {
    try {
        await connectToDatabase();

        const lead = await Lead.findByIdAndUpdate(
            id,
            { status, lastContactedAt: new Date() }, // Auto-update last contacted if status changes? Maybe not always.
            { new: true }
        );

        if (!lead) throw new Error("Lead not found");

        revalidatePath('/admin/crm');
        return clean(lead);
    } catch (error) {
        console.error("Error updating lead status:", error);
        throw new Error("Failed to update lead status");
    }
}

/**
 * Get CRM Analytics for dashboard
 */
export async function getCRMAnalytics() {
    try {
        await connectToDatabase();

        // 1. Leads by Status
        const statusDistribution = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 2. Leads by Source
        const sourceDistribution = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // 3. New Leads (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentLeads = await Lead.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // 4. Conversion Rate
        const totalLeads = await Lead.countDocuments();
        const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
        const conversionRate = totalLeads > 0
            ? ((convertedLeads / totalLeads) * 100).toFixed(1)
            : 0;

        // 5. Monthly Trend (Last 6 months)
        const trend = await Lead.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return {
            statusDistribution,
            sourceDistribution,
            totalLeads,
            recentLeads,
            conversionRate,
            trend
        };

    } catch (error) {
        console.error("Error fetching CRM analytics:", error);
        return {
            statusDistribution: [],
            sourceDistribution: [],
            totalLeads: 0,
            recentLeads: 0,
            conversionRate: 0,
            trend: []
        };
    }
}

export async function deleteLead(id: string) {
    try {
        await connectToDatabase();
        await Lead.findByIdAndDelete(id);
        revalidatePath('/admin/crm');
        return { success: true };
    } catch (error) {
        console.error("Error deleting lead:", error);
        throw new Error("Failed to delete lead");
    }
}
