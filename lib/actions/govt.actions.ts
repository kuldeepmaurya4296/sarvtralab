
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { clean } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getGovtStudentData() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'govt') {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    try {
        const govtUser = await User.findOne({ id: session.user.id }).lean() as any;
        if (!govtUser) throw new Error("Govt official not found");

        const assignedSchoolIds = govtUser.assignedSchools || [];

        // Fetch schools assigned to this official
        const schools = await User.find({
            id: { $in: assignedSchoolIds },
            role: 'school'
        }).lean();

        // Fetch students belonging to these schools
        // Currently students store schoolName as string, but we also added schoolId as ObjectId ref.
        // Let's search by schoolId in assignedSchoolIds OR schoolName if necessary.
        // Given schools are also in User collection with their own 'id', we can search by schoolId.

        // We need the ObjectIds of the schools too if schoolId is ObjectId ref.
        const schoolObjectIds = schools.map(s => s._id);

        const students = await User.find({
            role: 'student',
            $or: [
                { schoolId: { $in: schoolObjectIds } },
                { schoolName: { $in: schools.map(s => s.name) } }
            ]
        }).lean();

        return {
            govtOrg: clean(govtUser),
            schools: schools.map(clean),
            students: students.map(clean)
        };
    } catch (e) {
        console.error("Govt Student Data Error:", e);
        return {
            govtOrg: null,
            schools: [],
            students: []
        };
    }
}

export async function getAllGovtOrgs() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    const orgs = await User.find({ role: 'govt' }).lean();
    return orgs.map(clean);
}

export async function createGovtOrg(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();

    // Check if email already exists
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password || 'govt123', 10);

    const org = await User.create({
        ...data,
        password: hashedPassword,
        id: `gov-${Date.now()}`,
        role: 'govt'
    });

    revalidatePath('/admin/govt');
    return clean(org);
}

export async function updateGovtOrg(id: string, data: any) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    } else {
        delete data.password;
    }

    const org = await User.findOneAndUpdate({ id }, data, { new: true }).lean();
    revalidatePath('/admin/govt');
    return clean(org);
}

export async function deleteGovtOrg(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    await User.deleteOne({ id });
    revalidatePath('/admin/govt');
    return true;
}
