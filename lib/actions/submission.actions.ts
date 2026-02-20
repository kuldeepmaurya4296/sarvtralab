
'use server';

import connectToDatabase from '@/lib/mongoose';
import Submission from '@/lib/models/Submission';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { revalidatePath } from 'next/cache';
import { clean } from '@/lib/utils';

export async function submitAssignment(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'student') {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const submission = await Submission.create({
            ...data,
            student: (session.user as any).dbId,
            submittedAt: new Date()
        });
        revalidatePath('/student/assignments');
        return clean(submission);
    } catch (e) {
        console.error("Submit Assignment Error:", e);
        throw e;
    }
}

export async function gradeSubmission(submissionId: string, gradeData: { score: number, feedback: string }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'school')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const submission = await Submission.findByIdAndUpdate(submissionId, {
            ...gradeData,
            status: 'Graded'
        }, { new: true });
        revalidatePath('/teacher/assignments');
        return clean(submission);
    } catch (e) {
        console.error("Grade Submission Error:", e);
        throw e;
    }
}

export async function getSubmissionsByAssignment(assignmentId: string) {
    await connectToDatabase();
    const submissions = await Submission.find({ assignment: assignmentId }).populate('student', 'name').lean();
    return clean(submissions);
}
