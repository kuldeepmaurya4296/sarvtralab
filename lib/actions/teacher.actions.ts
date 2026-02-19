
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { Teacher } from '@/data/users';
import bcrypt from 'bcryptjs';

const clean = (doc: any) => {
    if (!doc) return null;
    const obj = JSON.parse(JSON.stringify(doc));
    delete obj._id;
    delete obj.password;
    return obj;
}

export async function getAllTeachers(): Promise<Teacher[]> {
    await connectToDatabase();
    const teachers = await User.find({ role: 'teacher' }).lean();
    return teachers.map(clean) as Teacher[];
}

export async function createTeacher(data: Partial<Teacher>): Promise<Teacher | null> {
    await connectToDatabase();
    try {
        const id = `tch-${Date.now()}`;
        const hashedPassword = await bcrypt.hash(data.password || 'teacher123', 10);

        const newTeacher = await User.create({
            ...data,
            id,
            password: hashedPassword,
            role: 'teacher',
            createdAt: new Date().toISOString()
        });
        return clean(newTeacher.toObject()) as Teacher;
    } catch (e) {
        console.error("Create Teacher Error:", e);
        return null;
    }
}

export async function updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher | null> {
    await connectToDatabase();
    try {
        // If password is being updated, hash it
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updated = await User.findOneAndUpdate(
            { id, role: 'teacher' },
            { $set: data },
            { new: true }
        ).lean();
        return clean(updated) as Teacher;
    } catch (e) {
        console.error("Update Teacher Error:", e);
        return null;
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
