
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { School } from '@/data/users';

const clean = (doc: any) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { ...rest, id: doc.id };
}

export async function getAllSchools(): Promise<School[]> {
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
    await connectToDatabase();
    try {
        const id = `sch-${Date.now()}`;
        const newSchool = await User.create({
            ...data,
            id,
            role: 'school',
            assignedCourses: [],
            createdAt: new Date().toISOString()
        });
        return clean(newSchool.toObject()) as School;
    } catch (e) {
        console.error("Create School Error:", e);
        return null;
    }
}

export async function updateSchool(id: string, updates: Partial<School>): Promise<School | null> {
    await connectToDatabase();
    try {
        const updated = await User.findOneAndUpdate(
            { id, role: 'school' },
            { $set: updates },
            { new: true }
        ).lean();
        return clean(updated) as School | null;
    } catch (e) {
        console.error("Update School Error:", e);
        return null;
    }
}
