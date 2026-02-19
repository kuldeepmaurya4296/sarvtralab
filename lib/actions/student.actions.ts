
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { Student } from '@/data/users';

// Helper to sanitize
const clean = (doc: any) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { ...rest, id: doc.id };
}

export async function getAllStudents(schoolId?: string): Promise<Student[]> {
    await connectToDatabase();
    const query: any = { role: 'student' };
    if (schoolId) query.schoolId = schoolId;

    const students = await User.find(query).lean();
    return students.map(clean) as Student[];
}

export async function getStudentById(id: string): Promise<Student | null> {
    await connectToDatabase();
    const student = await User.findOne({ id, role: 'student' }).lean();
    return clean(student) as Student | null;
}

export async function createStudent(data: Partial<Student>): Promise<Student | null> {
    await connectToDatabase();
    try {
        const id = `std-${Date.now()}`;
        const newStudent = await User.create({
            ...data,
            id,
            role: 'student',
            enrolledCourses: [],
            completedCourses: [],
            createdAt: new Date().toISOString()
        });
        return clean(newStudent.toObject()) as Student;
    } catch (e) {
        console.error("Create Student Error:", e);
        return null;
    }
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    await connectToDatabase();
    try {
        const updated = await User.findOneAndUpdate(
            { id, role: 'student' },
            { $set: updates },
            { new: true }
        ).lean();
        return clean(updated) as Student | null;
    } catch (e) {
        console.error("Update Student Error:", e);
        return null;
    }
}

export async function deleteStudent(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
        const res = await User.deleteOne({ id, role: 'student' });
        return res.deletedCount === 1;
    } catch (e) {
        console.error("Delete Student Error:", e);
        return false;
    }
}
