
'use server';

import connectToDatabase from '@/lib/mongoose';
import Assignment from '@/lib/models/Assignment';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { revalidatePath } from 'next/cache';
import { clean } from '@/lib/utils';

export async function createAssignment(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'school' && session.user.role !== 'superadmin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const assignment = await Assignment.create(data);
        revalidatePath('/student/assignments');
        revalidatePath('/teacher/assignments');
        return clean(assignment);
    } catch (e) {
        console.error("Create Assignment Error:", e);
        throw e;
    }
}

export async function getAssignmentsByCourse(courseId: string) {
    await connectToDatabase();
    const assignments = await Assignment.find({ course: courseId }).lean();
    return clean(assignments);
}

export async function deleteAssignment(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'school' && session.user.role !== 'superadmin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    await Assignment.findByIdAndDelete(id);
    revalidatePath('/teacher/assignments');
}
