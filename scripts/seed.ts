
import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongoose';
import User from '../lib/models/User';
import School from '../lib/models/School';
import Course from '../lib/models/Course';
import Enrollment from '../lib/models/Enrollment';
import ActivityLog from '../lib/models/ActivityLog';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Starting Seeding...');
    await connectToDatabase();

    // Clear existing data (CAUTION)
    console.log('🧹 Clearing existing data...');
    await School.deleteMany({});
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await ActivityLog.deleteMany({});

    // 1. Create Schools
    console.log('🏫 Creating Schools...');
    const dpsSchool = await School.create({
        id: 'sch-001',
        name: 'Delhi Public School, Noida',
        email: 'admin@dpsnoida.edu.in',
        schoolCode: 'DPS-NOI-001',
        principalName: 'Dr. Meera Gupta',
        schoolType: 'private',
        board: 'CBSE',
        totalStudents: 2500,
        address: 'Sector 30',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201303',
        phone: '+91 120 4567890',
        websiteUrl: 'https://dpsnoida.edu.in',
        subscriptionPlan: 'premium',
        subscriptionExpiry: '2026-03-31',
        createdAt: new Date().toISOString()
    });

    // 2. Create Users
    console.log('👤 Creating Users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const superAdmin = await User.create({
        id: 'admin-001',
        email: 'superadmin@sarvtralab.in',
        password: hashedPassword,
        role: 'superadmin',
        name: 'System Administrator',
        permissions: ['all'],
        createdAt: new Date().toISOString()
    });

    const schoolAdmin = await User.create({
        id: 'usr-sch-001',
        email: 'admin@dpsnoida.edu.in', // Same as school email for convenience
        password: hashedPassword,
        role: 'school',
        name: 'DPS Admin',
        schoolId: dpsSchool._id,
        schoolName: dpsSchool.name,
        createdAt: new Date().toISOString()
    });

    const teacher = await User.create({
        id: 'tch-001',
        email: 'vikram.sharma@sarvtralab.in',
        password: hashedPassword,
        role: 'teacher',
        name: 'Vikram Sharma',
        schoolId: dpsSchool._id,
        schoolName: dpsSchool.name,
        specialization: 'Robotics & Electronics',
        qualifications: 'M.Tech in Robotics, IIT Delhi',
        experience: 8,
        createdAt: new Date().toISOString()
    });

    const student = await User.create({
        id: 'std-001',
        email: 'arjun.patel@student.sarvtralab.in',
        password: hashedPassword,
        role: 'student',
        name: 'Arjun Patel',
        schoolId: dpsSchool._id,
        schoolName: dpsSchool.name,
        grade: 'Class 6',
        createdAt: new Date().toISOString()
    });

    // 3. Create Courses
    console.log('📚 Creating Courses...');
    const roboticsCourse = await Course.create({
        id: 'crs-001',
        title: 'Foundation of Robotics',
        description: 'Introduction to basic robotics and electronics.',
        price: 4999,
        category: 'foundation',
        level: 'Beginner',
        instructor: teacher._id,
        schoolId: dpsSchool._id,
        curriculum: [
            {
                id: 'mod-1',
                title: 'Introduction',
                lessons: [
                    { id: 'les-1', title: 'What is Robotics?', duration: '15m', type: 'video' }
                ]
            }
        ],
        createdAt: new Date().toISOString()
    });

    // 4. Create Enrollments
    console.log('📝 Creating Enrollments...');
    await Enrollment.create({
        student: student.id, // User model uses custom string 'id' for enrollments in some parts, but lets check model
        course: roboticsCourse._id,
        status: 'Active',
        progress: 10,
        enrolledAt: new Date()
    });

    // Sync enrollment back to User for legacy support if needed
    await User.findByIdAndUpdate(student._id, {
        $push: { enrolledCourses: roboticsCourse.id }
    });

    // 5. Create Activity Logs
    console.log('📜 Creating Activity Logs...');
    await ActivityLog.create({
        user: superAdmin.id,
        userRole: 'superadmin',
        action: 'SEED_DATA',
        details: 'Initial system seeding completed',
        timestamp: new Date()
    });

    console.log('✅ Seeding Completed Successfully!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
