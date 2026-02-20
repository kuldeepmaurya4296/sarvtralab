'use server';

import connectToDatabase from '@/lib/mongoose';
import Plan from '@/lib/models/Plan';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { clean } from '@/lib/utils';

export async function getAllPlans() {
    await connectToDatabase();
    const plans = await Plan.find({ status: 'active' }).sort({ createdAt: 1 }).lean();
    return clean(plans);
}

export async function getAdminPlans() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    const plans = await Plan.find({}).sort({ createdAt: 1 }).lean();
    return clean(plans);
}

export async function createPlan(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const plan = await Plan.create({
            ...data,
            id: `pln-${Date.now()}`
        });
        revalidatePath('/admin/plans');
        revalidatePath('/schools');
        return clean(plan);
    } catch (e) {
        console.error("Create Plan Error:", e);
        throw e;
    }
}

export async function updatePlan(id: string, data: any) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const plan = await Plan.findOneAndUpdate({ id }, data, { new: true }).lean();
        revalidatePath('/admin/plans');
        revalidatePath('/schools');
        return clean(plan);
    } catch (e) {
        console.error("Update Plan Error:", e);
        throw e;
    }
}

export async function deletePlan(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        await Plan.deleteOne({ id });
        revalidatePath('/admin/plans');
        revalidatePath('/schools');
        return true;
    } catch (e) {
        console.error("Delete Plan Error:", e);
        return false;
    }
}
