'use server';

import Enrollment from '../models/Enrollment';
import User from '../models/User';
import Course from '../models/Course';
import connectToDatabase from '../mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import bcrypt from 'bcryptjs';
import { logActivity, sendNotification } from './activity.actions';
import { clean } from '@/lib/utils';

const scrubStudent = (doc: any) => {
    const obj = clean(doc);
    if (obj) delete obj.password;
    return obj;
}

export async function getAllStudents() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const students = await User.find({ role: 'student' }).lean();
        return students.map(scrubStudent);
    } catch (e) {
        console.error("Get All Students Error:", e);
        return [];
    }
}

export async function createStudent(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin' && session.user.role !== 'school')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const existing = await User.findOne({ email: data.email }).lean();
        if (existing) {
            throw new Error(`Student with email ${data.email} already exists.`);
        }

        const id = `std-${Date.now()}`;
        const hashedPassword = await bcrypt.hash(data.password || 'student123', 10);

        const newStudent = await User.create({
            ...data,
            id,
            password: hashedPassword,
            role: 'student',
            createdAt: new Date().toISOString()
        });

        await logActivity(session.user.id, 'STUDENT_CREATE', `Created student: ${data.name} (${id})`);

        return scrubStudent(newStudent.toObject());
    } catch (e: any) {
        console.error("Create Student Error:", e);
        throw e;
    }
}

export async function updateStudent(id: string, updates: any) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin' && session.user.role !== 'school')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        if (updates.email) {
            const existing = await User.findOne({ email: updates.email, id: { $ne: id } }).lean();
            if (existing) {
                throw new Error(`Email ${updates.email} is already taken.`);
            }
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updated = await User.findOneAndUpdate(
            { id, role: 'student' },
            { $set: updates },
            { new: true }
        ).lean();

        await logActivity(session.user.id, 'STUDENT_UPDATE', `Updated student: ${id}`);

        return scrubStudent(updated);
    } catch (e: any) {
        console.error("Update Student Error:", e);
        throw e;
    }
}

export async function deleteStudent(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin' && session.user.role !== 'school')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        await User.deleteOne({ id, role: 'student' });
        await logActivity(session.user.id, 'STUDENT_DELETE', `Deleted student: ${id}`);
        return true;
    } catch (e) {
        console.error("Delete Student Error:", e);
        return false;
    }
}

export async function getStudentDashboardStats(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.id !== userId && session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const enrollments = await Enrollment.find({ student: userId }).populate('course').lean() as any[];

        if (enrollments.length === 0) {
            return {
                totalEnrolled: 0,
                certificatesCount: 0,
                watchTime: "0 hrs",
                overallProgress: "0%",
                enrolledCourses: []
            };
        }

        const totalEnrolled = enrollments.length;
        const totalProgress = enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0);
        const overallProgress = (totalProgress / totalEnrolled).toFixed(0) + "%";

        // Total watch time (dummy mapping for now, should be in a model)
        const totalWatchMinutes = enrollments.reduce((acc, curr) => acc + (curr.watchTime || 0), 0);
        const watchTimeStr = `${Math.floor(totalWatchMinutes / 60)} hrs`;

        return {
            totalEnrolled,
            overallProgress,
            watchTime: watchTimeStr,
            enrolledCourses: enrollments.map(e => ({
                id: e.course.id,
                title: e.course.title,
                progress: e.progress || 0,
                thumbnail: e.course.thumbnail,
                totalLessons: e.course.curriculum?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0,
                completedLessons: e.completedLessons || 0
            }))
        };
    } catch (e) {
        console.error("Student Dashboard Stats Error:", e);
        return null;
    }
}

export async function getStudentEnrolledCourses(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.id !== userId && session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const enrollments = await Enrollment.find({ student: userId })
            .populate('course')
            .lean() as any[];

        return enrollments.map(e => ({
            ...(e.course ? clean(e.course) : { title: 'Course Unavailable', id: null }),
            enrollmentId: e._id.toString(),
            isUnavailable: !e.course,
            progress: e.progress || 0,
            completedLessons: e.completedLessons || 0,
            status: e.status,
            enrolledAt: e.enrolledAt
        }));
    } catch (e) {
        console.error("Get Student Enrolled Courses Error:", e);
        return [];
    }
}

export async function removeEnrollment(enrollmentId: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await connectToDatabase();
    try {
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) throw new Error("Enrollment not found");

        // Only allow student to delete their own, or admin
        if (enrollment.student !== session.user.id && session.user.role !== 'superadmin' && session.user.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        await Enrollment.findByIdAndDelete(enrollmentId);
        return { success: true };
    } catch (error: any) {
        console.error("Remove Enrollment Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getUniqueGrades(schoolId: string) {
    await connectToDatabase();
    try {
        const grades = await User.distinct('grade', { schoolId, role: 'student' });
        return grades.filter(Boolean);
    } catch (e) {
        console.error("Get Unique Grades Error:", e);
        return [];
    }
}

export async function getStudentById(id: string) {
    await connectToDatabase();
    try {
        const student = await User.findOne({ id, role: 'student' }).lean();
        return scrubStudent(student);
    } catch (e) {
        console.error("Get Student By Id Error:", e);
        return null;
    }
}

export async function checkEnrollmentStatus(userId: string, courseId: string) {
    await connectToDatabase();
    try {
        const course = await Course.findOne({ id: courseId });
        if (!course) return false;

        const enrollment = await Enrollment.findOne({
            student: userId,
            course: course._id
        }).lean();

        return !!enrollment;
    } catch (e) {
        console.error("Check Enrollment Status Error:", e);
        return false;
    }
}
