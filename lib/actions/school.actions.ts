'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import Course from '../models/Course';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { School } from '@/data/users';
import { logActivity, sendNotification } from './activity.actions';
import { clean } from '@/lib/utils';

export async function getAllSchools(): Promise<School[]> {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    const schools = await User.find({ role: 'school' }).lean();
    return schools.map(clean) as School[];
}

export async function getSchoolById(id: string): Promise<School | null> {
    await connectToDatabase();
    const school = await User.findOne({ id, role: 'school' }).lean();
    return clean(school) as School | null;
}

export async function createSchool(data: Partial<School>): Promise<School | null> {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const existing = await User.findOne({ email: data.email }).lean();
        if (existing) {
            throw new Error(`School with email ${data.email} already exists.`);
        }

        const id = `sch-${Date.now()}`;
        const newSchool = await User.create({
            ...data,
            id,
            role: 'school',
            assignedCourses: [],
            createdAt: new Date().toISOString()
        });

        await logActivity(session.user.id, 'SCHOOL_CREATE', `Created school: ${data.name} (${id})`);

        return clean(newSchool.toObject()) as School;
    } catch (e: any) {
        console.error("Create School Error:", e);
        throw e;
    }
}

export async function updateSchool(id: string, updates: Partial<School>): Promise<School | null> {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        if (updates.email) {
            const existing = await User.findOne({ email: updates.email, id: { $ne: id } }).lean();
            if (existing) {
                throw new Error(`Email ${updates.email} is already taken by another user.`);
            }
        }

        const updated = await User.findOneAndUpdate(
            { id, role: 'school' },
            { $set: updates },
            { new: true }
        ).lean();

        await logActivity(session.user.id, 'SCHOOL_UPDATE', `Updated school: ${id}`);

        return clean(updated) as School | null;
    } catch (e: any) {
        console.error("Update School Error:", e);
        throw e;
    }
}

export async function deleteSchool(id: string): Promise<boolean> {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const res = await User.deleteOne({ id, role: 'school' });
        return res.deletedCount === 1;
    } catch (e) {
        console.error("Delete School Error:", e);
        return false;
    }
}
