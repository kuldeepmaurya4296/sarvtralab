
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import Lead from '@/lib/models/Lead';
import { School } from '@/data/users';

/* -------------------------------------------------------------------------- */
/*                               School Dashboard                             */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                               School Dashboard                             */
/* -------------------------------------------------------------------------- */

export async function getSchoolDashboardStats(schoolId: string) {
    await connectToDatabase();

    // 1. Get School Details
    const schoolDoc = await User.findOne({ id: schoolId, role: 'school' }).lean();
    if (!schoolDoc) throw new Error("School not found");
    const school = schoolDoc as any;

    // 2. Get Students for this school
    const students = await User.find({ schoolId, role: 'student' }).lean();

    const totalStudents = students.length;
    const activeStudents = students.filter((s: any) => s.enrolledCourses && s.enrolledCourses.length > 0).length;
    const coursesAssigned = school.assignedCourses?.length || 0;

    // 3. Calculate Completion Rate
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

    // 4. Top Performers
    const sortedStudents = [...students].sort((a: any, b: any) => {
        return (b.completedCourses?.length || 0) - (a.completedCourses?.length || 0);
    });

    const topPerformers = sortedStudents.slice(0, 3).map((s: any) => ({
        name: s.name,
        completed: s.completedCourses?.length || 0
    }));

    // Monthly Growth (School Students)
    // Simplified: Just last 6 months of student creation
    const growthData = await User.aggregate([
        { $match: { role: 'student', schoolId: schoolId } },
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
        schoolName: school.name,
        principalName: school.principalName,
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

    // Schools List
    const schoolsDocs = await User.find({ role: 'school' }).lean();
    const schools = schoolsDocs.map((s: any) => ({
        id: s.id,
        name: s.name,
        city: s.city,
        totalStudents: s.totalStudents || 0 // Again, check if this field exists or compute it
    }));

    return {
        totalSchools,
        totalStudents,
        schools
    };
}
