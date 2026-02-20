'use server';

import connectToDatabase from '@/lib/mongoose';
import Report from '@/lib/models/Report';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { clean } from '@/lib/utils';

export async function getReportsBySchool(schoolId: string) {
    await connectToDatabase();
    const reports = await Report.find({ schoolId }).sort({ createdAt: -1 }).lean();
    return clean(reports);
}

export async function getAllReports() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin' && session.user.role !== 'govt')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    const reports = await Report.find({}).sort({ createdAt: -1 }).lean();
    return clean(reports);
}

export async function createReport(data: any) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await connectToDatabase();
    try {
        const report = await Report.create({
            ...data,
            id: `rpt-${Date.now()}`,
            generatedAt: new Date().toISOString(),
            status: 'Ready', // Simulating successful generation
            size: '1.2 MB'
        });
        revalidatePath('/school/reports');
        revalidatePath('/govt/reports');
        return clean(report);
    } catch (e) {
        console.error("Create Report Error:", e);
        throw e;
    }
}

export async function deleteReport(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await connectToDatabase();
    try {
        await Report.deleteOne({ id });
        revalidatePath('/school/reports');
        revalidatePath('/govt/reports');
        return true;
    } catch (e) {
        console.error("Delete Report Error:", e);
        return false;
    }
}
