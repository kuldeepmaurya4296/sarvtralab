'use server';

import connectToDatabase from '@/lib/mongoose';
import Course from '@/lib/models/Course';
import { Course as CourseType } from '@/data/courses';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { logActivity, sendNotification } from './activity.actions';

import { clean } from '@/lib/utils';

export async function getAllCourses(): Promise<CourseType[]> {
    await connectToDatabase();
    const courses = await Course.find({}).lean();
    return courses.map(clean) as CourseType[];
}

export async function getCourseById(id: string): Promise<CourseType | null> {
    await connectToDatabase();
    const course = await Course.findOne({ id }).lean();
    return clean(course) as CourseType | null;
}

export async function getCoursesByIds(ids: string[]): Promise<CourseType[]> {
    await connectToDatabase();
    if (!ids || ids.length === 0) return [];

    const courses = await Course.find({ id: { $in: ids } }).lean();
    return courses.map(clean) as CourseType[];
}

export async function createCourse(data: Partial<CourseType>): Promise<CourseType | null> {
    const session = await getServerSession(authOptions);
    const allowedRoles = ['school', 'teacher', 'superadmin', 'admin'];
    if (!session || !allowedRoles.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const id = `crs-${Date.now()}`;
        const newCourse = await Course.create({
            ...data,
            id,
            createdAt: new Date().toISOString()
        });

        await logActivity(session.user.id, 'COURSE_CREATE', `Created course: ${data.title} (${id})`);

        return clean(newCourse.toObject()) as CourseType;
    } catch (e) {
        console.error("Create Course Error:", e);
        return null;
    }
}

export async function updateCourse(id: string, data: Partial<CourseType>): Promise<CourseType | null> {
    const session = await getServerSession(authOptions);
    const allowedRoles = ['school', 'teacher', 'superadmin', 'admin'];
    if (!session || !allowedRoles.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const updated = await Course.findOneAndUpdate(
            { id },
            { $set: data },
            { new: true }
        ).lean();

        await logActivity(session.user.id, 'COURSE_UPDATE', `Updated course: ${id}`);

        return clean(updated) as CourseType | null;
    } catch (e) {
        console.error("Update Course Error:", e);
        return null;
    }
}

export async function deleteCourse(id: string): Promise<boolean> {
    const session = await getServerSession(authOptions);
    const allowedRoles = ['school', 'teacher', 'superadmin', 'admin'];
    if (!session || !allowedRoles.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        await Course.deleteOne({ id });
        return true;
    } catch (e) {
        console.error("Delete Course Error:", e);
        return false;
    }
}
