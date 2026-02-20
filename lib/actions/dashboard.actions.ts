'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import Lead from '@/lib/models/Lead';
import Enrollment from '@/lib/models/Enrollment';
import Payment from '@/lib/models/Payment';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import SchoolModel from '@/lib/models/School';
import { School } from '@/data/users';
import mongoose from 'mongoose';

/* -------------------------------------------------------------------------- */
/*                               School Dashboard                             */
/* -------------------------------------------------------------------------- */

export async function getSchoolDashboardStats(schoolId: string) {
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(schoolId);

    // 1. Get School Admin User details
    // It's safer to check both the custom 'id' and the MongoDB '_id'
    const schoolUserDoc = await User.findOne({
        $or: [
            { id: schoolId },
            ...(isObjectId ? [{ _id: schoolId }] : [])
        ],
        role: 'school'
    }).lean();

    if (!schoolUserDoc) {
        console.error(`School Admin user not found for ID: ${schoolId}`);
        throw new Error("School not found");
    }

    const schoolUser = schoolUserDoc as any;
    let combinedSchoolData = { ...schoolUser };

    // 2. Fetch School Entity details if linked
    const actualSchoolObjectId = schoolUser.schoolId;
    if (actualSchoolObjectId) {
        const schoolEntity = await SchoolModel.findById(actualSchoolObjectId).lean();
        if (schoolEntity) {
            combinedSchoolData = { ...combinedSchoolData, ...(schoolEntity as any) };
        }
    }

    const school = combinedSchoolData;

    // 3. Get Students for this school
    // Query by the actual schoolId reference (ObjectId)
    const students = await User.find({
        schoolId: actualSchoolObjectId,
        role: 'student'
    }).lean();

    const totalStudents = students.length;
    const activeStudents = students.filter((s: any) => s.enrolledCourses && s.enrolledCourses.length > 0).length;
    const coursesAssigned = school.assignedCourses?.length || 0;

    // 4. Calculate Completion Rate
    let totalEnrolled = 0;
    let totalCompleted = 0;

    // Enrollment Data for Charts (School Specific)
    const courseStats: Record<string, { enrolled: number, completed: number }> = {};

    students.forEach((s: any) => {
        const enrolled = s.enrolledCourses || [];
        const completed = s.completedCourses || [];

        totalEnrolled += enrolled.length;
        totalCompleted += completed.length;

        enrolled.forEach((cId: string) => {
            if (!courseStats[cId]) courseStats[cId] = { enrolled: 0, completed: 0 };
            courseStats[cId].enrolled++;
        });

        completed.forEach((cId: string) => {
            if (!courseStats[cId]) courseStats[cId] = { enrolled: 0, completed: 0 };
            courseStats[cId].completed++;
        });
    });

    const completionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

    // Fetch Course Titles for Chart
    const courseIds = Object.keys(courseStats);
    const courses = await Course.find({ id: { $in: courseIds } }).select('id title').lean();

    const courseEnrollment = courses.map((c: any) => ({
        course: c.title,
        enrolled: courseStats[c.id]?.enrolled || 0,
        completed: courseStats[c.id]?.completed || 0
    })).slice(0, 5); // Limit to top 5 for UI

    // 5. Top Performers
    const sortedStudents = [...students].sort((a: any, b: any) => {
        return (b.completedCourses?.length || 0) - (a.completedCourses?.length || 0);
    });

    const topPerformers = sortedStudents.slice(0, 3).map((s: any) => ({
        name: s.name,
        completed: s.completedCourses?.length || 0
    }));

    // Monthly Growth (School Students)
    const growthData = await User.aggregate([
        { $match: { role: 'student', schoolId: actualSchoolObjectId } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: { $toDate: "$createdAt" } } },
                students: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        { $limit: 6 }
    ]);

    const chartData = growthData.map(g => ({
        name: g._id, // "2024-01"
        students: g.students
    }));

    return {
        schoolName: school.name || school.schoolName || "Unknown School",
        principalName: school.principalName || "Not Set",
        email: school.email,
        totalStudents,
        activeStudents,
        coursesAssigned,
        completionRate,
        topPerformers,
        courseEnrollment,
        chartData
    };
}


/* -------------------------------------------------------------------------- */
/*                                Admin Dashboard                             */
/* -------------------------------------------------------------------------- */

export async function getAdminDashboardStats() {
    await connectToDatabase();

    // 1. Counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSchools = await User.countDocuments({ role: 'school' });

    // 2. Revenue (Aggregation)
    // Using $lookup to join courses and calculate revenue
    const revenueResult = await User.aggregate([
        { $match: { role: 'student' } },
        { $unwind: '$enrolledCourses' },
        {
            $lookup: {
                from: 'courses',
                localField: 'enrolledCourses',
                foreignField: 'id',
                as: 'courseDetails'
            }
        },
        { $unwind: '$courseDetails' },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$courseDetails.price' }
            }
        }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // 3. Course Distribution
    const foundationCount = await Course.countDocuments({ category: 'foundation' });
    const intermediateCount = await Course.countDocuments({ category: 'intermediate' });
    const advancedCount = await Course.countDocuments({ category: 'advanced' });

    const pieData = [
        { name: 'Foundation', value: foundationCount },
        { name: 'Intermediate', value: intermediateCount },
        { name: 'Advanced', value: advancedCount }
    ];

    // 4. Recent Schools
    const recentSchoolsDocs = await User.find({ role: 'school' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const recentSchools = recentSchoolsDocs.map((s: any) => ({
        id: s.id,
        name: s.name,
        city: s.city,
        totalStudents: s.totalStudents || 0,
        subscriptionPlan: s.subscriptionPlan || 'basic'
    }));

    // 5. Growth Data (Monthly)
    const growthResult = await User.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: { $toDate: "$createdAt" } } },
                students: { $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] } },
                schools: { $sum: { $cond: [{ $eq: ["$role", "school"] }, 1, 0] } }
            }
        },
        { $sort: { _id: 1 } },
        { $limit: 12 }
    ]);

    // Fill in missing months? For now just return what data exists
    const chartData = growthResult.map(g => ({
        name: g._id, // e.g. "2024-02"
        students: g.students,
        schools: g.schools
    }));

    // 6. Course Enrollment vs Completion
    // Separate aggregations for clarity
    const enrolledCounts = await User.aggregate([
        { $match: { role: 'student' } },
        { $unwind: '$enrolledCourses' },
        { $group: { _id: '$enrolledCourses', count: { $sum: 1 } } }
    ]);

    const completedCounts = await User.aggregate([
        { $match: { role: 'student' } },
        { $unwind: '$completedCourses' },
        { $group: { _id: '$completedCourses', count: { $sum: 1 } } }
    ]);

    // 7. CRM Stats (Leads & Conversion)
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Get course names
    const allCourses = await Course.find({}).select('id title').lean();

    const courseEnrollment = allCourses.map((c: any) => {
        const enrolled = enrolledCounts.find(e => e._id === c.id)?.count || 0;
        const completed = completedCounts.find(cItem => cItem._id === c.id)?.count || 0;
        return {
            course: c.title,
            enrolled,
            completed
        };
    })
        .sort((a, b) => b.enrolled - a.enrolled)
        .slice(0, 5);

    return {
        totalStudents,
        totalSchools,
        totalRevenue,
        pieData,
        recentSchools,
        chartData, // For LineChart
        courseEnrollment, // For BarChart
        crmStats: {
            totalLeads,
            convertedLeads,
            conversionRate
        }
    };
}


/* -------------------------------------------------------------------------- */
/*                                Govt Dashboard                              */
/* -------------------------------------------------------------------------- */

export async function getGovtDashboardStats() {
    await connectToDatabase();

    const totalSchools = await User.countDocuments({ role: 'school' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalReports = await Course.countDocuments({}); // Placeholder for logic if needed

    // Schools List
    const schoolsDocs = await User.find({ role: 'school' }).limit(10).lean();
    const schools = schoolsDocs.map((s: any) => ({
        id: s.id,
        name: s.name,
        city: s.city,
        totalStudents: s.totalStudents || 0
    }));

    // Calculate overall completion rate across all students if data allows
    const students = await User.find({ role: 'student' }).select('enrolledCourses completedCourses').lean();
    let totalEnrolled = 0;
    let totalCompleted = 0;
    students.forEach((s: any) => {
        totalEnrolled += (s.enrolledCourses?.length || 0);
        totalCompleted += (s.completedCourses?.length || 0);
    });
    const avgCompletion = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

    return {
        totalSchools,
        totalStudents,
        avgCompletion: `${avgCompletion}%`,
        reportsCount: await Course.countDocuments({}), // Just a number for UI
        schools
    };
}

/* -------------------------------------------------------------------------- */
/*                               Teacher Dashboard                            */
/* -------------------------------------------------------------------------- */

export async function getTeacherDashboardStats(teacherId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.id !== teacherId && session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const teacher = await User.findOne({
            $or: [{ id: teacherId }, { _id: teacherId }]
        }).lean() as any;

        if (!teacher) throw new Error("Teacher not found");

        const teacherObjectId = teacher._id;

        const courses = await Course.find({ instructor: teacherObjectId }).lean() as any[];
        const totalCourses = courses.length;

        const courseIds = courses.map(c => c._id);
        const enrollments = await Enrollment.find({ course: { $in: courseIds } }).lean() as any[];
        const totalStudents = new Set(enrollments.map(e => e.student)).size;

        const avgCompletion = enrollments.length > 0
            ? (enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length).toFixed(1)
            : "0";

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const activityTrend = await Enrollment.aggregate([
            { $match: { course: { $in: courseIds }, enrolledAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$enrolledAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trendData = activityTrend.map(t => ({
            name: monthNames[t._id - 1],
            students: t.count
        }));

        return {
            totalCourses,
            totalStudents,
            avgCompletion,
            trendData,
            recentCourses: courses.slice(0, 5).map(c => ({
                id: c.id,
                title: c.title,
                students: enrollments.filter(e => e.course.toString() === c._id.toString()).length,
                progress: 0,
                nextClass: new Date().toISOString()
            }))
        };
    } catch (e) {
        console.error("Teacher Dashboard Stats Error:", e);
        return {
            totalCourses: 0,
            totalStudents: 0,
            avgCompletion: "0",
            trendData: [],
            recentCourses: []
        };
    }
}
