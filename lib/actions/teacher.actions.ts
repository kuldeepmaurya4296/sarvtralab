
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { Teacher } from '@/data/users';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { logActivity, sendNotification } from './activity.actions';

import { clean } from '@/lib/utils';

const scrubTeacher = (doc: any) => {
    const obj = clean(doc);
    if (obj) {
        delete obj._id;
        delete obj.password;
    }
    return obj;
}

export async function getAllTeachers(): Promise<Teacher[]> {
    await connectToDatabase();
    const teachers = await User.find({ role: 'teacher' }).lean();
    return teachers.map(scrubTeacher) as Teacher[];
}

export async function createTeacher(data: Partial<Teacher>): Promise<Teacher | null> {
    await connectToDatabase();
    try {
        const existing = await User.findOne({ email: data.email }).lean();
        if (existing) {
            throw new Error(`Teacher with email ${data.email} already exists.`);
        }

        const id = `tch-${Date.now()}`;
        const hashedPassword = await bcrypt.hash(data.password || 'teacher123', 10);

        const newTeacher = await User.create({
            ...data,
            id,
            password: hashedPassword,
            role: 'teacher',
            createdAt: new Date().toISOString()
        });

        const session = await getServerSession(authOptions);
        if (session) {
            await logActivity(session.user.id, 'TEACHER_CREATE', `Created teacher: ${data.name} (${id})`);
        }

        return scrubTeacher(newTeacher.toObject()) as Teacher;
    } catch (e: any) {
        console.error("Create Teacher Error:", e);
        throw e;
    }
}

export async function updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher | null> {
    await connectToDatabase();
    try {
        if (data.email) {
            const existing = await User.findOne({ email: data.email, id: { $ne: id } }).lean();
            if (existing) {
                throw new Error(`Email ${data.email} is already taken by another user.`);
            }
        }

        // If password is being updated, hash it
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updated = await User.findOneAndUpdate(
            { id, role: 'teacher' },
            { $set: data },
            { new: true }
        ).lean();
        return scrubTeacher(updated) as Teacher;
    } catch (e: any) {
        console.error("Update Teacher Error:", e);
        throw e;
    }
}

export async function deleteTeacher(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
        await User.deleteOne({ id, role: 'teacher' });
        return true;
    } catch (e) {
        console.error("Delete Teacher Error:", e);
        return false;
    }
}

export async function assignSchools(teacherId: string, schoolIds: string[]): Promise<boolean> {
    await connectToDatabase();
    try {
        await User.updateOne(
            { id: teacherId, role: 'teacher' },
            { $set: { assignedSchools: schoolIds } }
        );
        return true;
    } catch (e) {
        console.error("Assign Schools Error:", e);
        return false;
    }
}
