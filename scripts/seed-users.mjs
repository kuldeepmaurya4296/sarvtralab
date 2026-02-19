/**
 * Seed Script: Inserts default users with hashed passwords into MongoDB.
 * 
 * Run with: node scripts/seed-users.mjs
 * 
 * This ensures all demo credentials work with bcrypt-based NextAuth login.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvtra_labs:kdbruWx8V7FVe88q@cluster0.hqcptct.mongodb.net/?appName=Cluster0';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const defaultUsers = [
    // Students
    {
        id: 'std-001',
        email: 'arjun.patel@student.sarvtralab.in',
        password: 'student123',
        role: 'student',
        name: 'Arjun Patel',
        schoolId: 'sch-001',
        schoolName: 'Delhi Public School, Noida',
        grade: 'Class 6',
        enrolledCourses: ['foundation-robotics-3m'],
        completedCourses: [],
        parentName: 'Rajesh Patel',
        parentPhone: '+91 98765 43210',
        parentEmail: 'rajesh.patel@email.com',
        dateOfBirth: '2013-05-15',
        address: '42, Sector 15',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        status: 'active',
        createdAt: '2025-01-15'
    },
    {
        id: 'std-002',
        email: 'priya.sharma@student.sarvtralab.in',
        password: 'student123',
        role: 'student',
        name: 'Priya Sharma',
        schoolId: 'sch-001',
        schoolName: 'Delhi Public School, Noida',
        grade: 'Class 8',
        enrolledCourses: ['intermediate-robotics-3m'],
        completedCourses: ['foundation-robotics-3m'],
        parentName: 'Amit Sharma',
        parentPhone: '+91 98765 43211',
        parentEmail: 'amit.sharma@email.com',
        dateOfBirth: '2011-08-22',
        address: '15, Sector 22',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        status: 'active',
        createdAt: '2024-08-10'
    },
    {
        id: 'std-003',
        email: 'rahul.verma@student.sarvtralab.in',
        password: 'student123',
        role: 'student',
        name: 'Rahul Verma',
        schoolId: 'sch-002',
        schoolName: 'Ryan International School',
        grade: 'Class 11',
        enrolledCourses: ['advanced-robotics-9m'],
        completedCourses: ['intermediate-robotics-6m'],
        parentName: 'Suresh Verma',
        parentPhone: '+91 98765 43212',
        parentEmail: 'suresh.verma@email.com',
        dateOfBirth: '2009-03-10',
        address: '78, MG Road',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        status: 'active',
        createdAt: '2024-06-01'
    },
    {
        id: 'std-004',
        email: 'kavita.singh@student.sarvtralab.in',
        password: 'student123',
        role: 'student',
        name: 'Kavita Singh',
        schoolId: 'sch-003',
        schoolName: 'Kendriya Vidyalaya, Delhi',
        grade: 'Class 9',
        enrolledCourses: ['advanced-robotics-3m'],
        completedCourses: [],
        parentName: 'Manoj Singh',
        parentPhone: '+91 98765 43213',
        parentEmail: 'manoj.singh@email.com',
        dateOfBirth: '2010-12-12',
        address: 'Sector 5',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110005',
        status: 'active',
        createdAt: '2024-07-20'
    },
    {
        id: 'std-005',
        email: 'rohan.das@student.sarvtralab.in',
        password: 'student123',
        role: 'student',
        name: 'Rohan Das',
        schoolId: 'sch-001',
        schoolName: 'Delhi Public School, Noida',
        grade: 'Class 5',
        enrolledCourses: ['foundation-robotics-6m'],
        completedCourses: [],
        parentName: 'Sunil Das',
        parentPhone: '+91 98765 43214',
        parentEmail: 'sunil.das@email.com',
        dateOfBirth: '2014-02-18',
        address: 'Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201309',
        status: 'active',
        createdAt: '2025-01-05'
    },
    // Schools
    {
        id: 'sch-001',
        email: 'admin@dpsnoida.edu.in',
        password: 'school123',
        role: 'school',
        name: 'Delhi Public School, Noida',
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
        assignedCourses: ['foundation-robotics-3m', 'foundation-robotics-6m', 'intermediate-robotics-3m'],
        createdAt: '2024-01-01'
    },
    {
        id: 'sch-002',
        email: 'admin@ryaninternational.edu.in',
        password: 'school123',
        role: 'school',
        name: 'Ryan International School',
        schoolCode: 'RIS-GUR-001',
        principalName: 'Mr. Vikram Singh',
        schoolType: 'private',
        board: 'CBSE',
        totalStudents: 1800,
        address: 'DLF Phase 3',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        phone: '+91 124 4567890',
        websiteUrl: 'https://ryaninternational.edu.in',
        subscriptionPlan: 'standard',
        subscriptionExpiry: '2025-12-31',
        assignedCourses: ['foundation-robotics-3m', 'intermediate-robotics-6m', 'advanced-robotics-9m'],
        createdAt: '2024-02-15'
    },
    {
        id: 'sch-003',
        email: 'admin@kvdelhi.edu.in',
        password: 'school123',
        role: 'school',
        name: 'Kendriya Vidyalaya, Delhi',
        schoolCode: 'KV-DEL-001',
        principalName: 'Mrs. Sunita Rao',
        schoolType: 'government',
        board: 'CBSE',
        totalStudents: 1200,
        address: 'R.K. Puram',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110022',
        phone: '+91 11 4567890',
        subscriptionPlan: 'basic',
        subscriptionExpiry: '2025-09-30',
        assignedCourses: ['foundation-robotics-3m'],
        createdAt: '2024-04-01'
    },
    // Govt Orgs
    {
        id: 'gov-001',
        email: 'director@education.gov.in',
        password: 'govt123',
        role: 'govt',
        name: 'Shri Ramesh Chandra',
        organizationType: 'education_dept',
        organizationName: 'Ministry of Education',
        designation: 'Joint Secretary',
        department: 'School Education & Literacy',
        jurisdiction: 'national',
        assignedSchools: ['sch-001', 'sch-002', 'sch-003'],
        status: 'active',
        createdAt: '2024-01-01'
    },
    {
        id: 'gov-002',
        email: 'director@upskill.gov.in',
        password: 'govt123',
        role: 'govt',
        name: 'Dr. Anita Kumari',
        organizationType: 'skill_ministry',
        organizationName: 'State Education Department',
        designation: 'Director',
        department: 'STEM Education',
        jurisdiction: 'state',
        state: 'Uttar Pradesh',
        assignedSchools: ['sch-001'],
        status: 'active',
        createdAt: '2024-03-01'
    },
    // SuperAdmin
    {
        id: 'admin-001',
        email: 'superadmin@sarvtralab.in',
        password: 'admin123',
        role: 'superadmin',
        name: 'System Administrator',
        permissions: ['all'],
        lastLogin: '2025-02-03T10:30:00',
        createdAt: '2024-01-01'
    },
    // Teachers
    {
        id: 'tch-001',
        email: 'vikram.sharma@sarvtralab.in',
        password: 'teacher123',
        role: 'teacher',
        name: 'Vikram Sharma',
        specialization: 'Robotics & Electronics',
        qualifications: 'M.Tech in Robotics, IIT Delhi',
        assignedCourses: ['foundation-robotics-3m', 'foundation-robotics-6m'],
        assignedSchools: ['sch-001', 'sch-002'],
        experience: 8,
        phone: '+91 98765 11111',
        status: 'active',
        createdAt: '2024-01-15'
    },
    {
        id: 'tch-002',
        email: 'priya.menon@sarvtralab.in',
        password: 'teacher123',
        role: 'teacher',
        name: 'Priya Menon',
        specialization: 'Programming & AI',
        qualifications: 'M.Sc Computer Science, BITS Pilani',
        assignedCourses: ['intermediate-robotics-3m', 'intermediate-robotics-6m'],
        assignedSchools: ['sch-001', 'sch-003'],
        experience: 5,
        phone: '+91 98765 22222',
        status: 'active',
        createdAt: '2024-02-01'
    },
    {
        id: 'tch-003',
        email: 'amit.kumar@sarvtralab.in',
        password: 'teacher123',
        role: 'teacher',
        name: 'Amit Kumar',
        specialization: 'Advanced Robotics & IoT',
        qualifications: 'PhD in Mechatronics, IISc Bangalore',
        assignedCourses: ['advanced-robotics-6m', 'advanced-robotics-9m'],
        assignedSchools: ['sch-002'],
        experience: 12,
        phone: '+91 98765 33333',
        status: 'active',
        createdAt: '2024-01-01'
    },
    // Help Support
    {
        id: 'help-001',
        email: 'support.rahul@sarvtralab.in',
        password: 'support123',
        role: 'helpsupport',
        name: 'Rahul Gupta',
        department: 'technical',
        assignedStudents: ['std-001', 'std-002'],
        ticketsResolved: 156,
        ticketsPending: 3,
        phone: '+91 98765 44444',
        status: 'available',
        createdAt: '2024-03-01'
    },
    {
        id: 'help-002',
        email: 'support.neha@sarvtralab.in',
        password: 'support123',
        role: 'helpsupport',
        name: 'Neha Singh',
        department: 'academic',
        assignedStudents: ['std-003'],
        ticketsResolved: 203,
        ticketsPending: 5,
        phone: '+91 98765 55555',
        status: 'available',
        createdAt: '2024-02-15'
    },
    {
        id: 'help-003',
        email: 'support.arun@sarvtralab.in',
        password: 'support123',
        role: 'helpsupport',
        name: 'Arun Krishnan',
        department: 'general',
        assignedStudents: [],
        ticketsResolved: 89,
        ticketsPending: 2,
        phone: '+91 98765 66666',
        status: 'busy',
        createdAt: '2024-04-01'
    }
];

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    let created = 0;
    let skipped = 0;
    let updated = 0;

    for (const userData of defaultUsers) {
        const { password, ...rest } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existing = await User.findOne({ email: userData.email });

        if (existing) {
            // Update password to hashed version (in case it was plain text before)
            await User.updateOne(
                { email: userData.email },
                { $set: { password: hashedPassword, ...rest } }
            );
            console.log(`🔄 Updated: ${userData.email} (${userData.role})`);
            updated++;
        } else {
            await User.create({ ...rest, password: hashedPassword });
            console.log(`✅ Created: ${userData.email} (${userData.role})`);
            created++;
        }
    }

    console.log(`\n========================================`);
    console.log(`🌱 Seed complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`========================================`);
    console.log(`\n📋 Login Credentials:`);
    console.log(`   Student:     arjun.patel@student.sarvtralab.in / student123`);
    console.log(`   School:      admin@dpsnoida.edu.in / school123`);
    console.log(`   Govt:        director@education.gov.in / govt123`);
    console.log(`   SuperAdmin:  superadmin@sarvtralab.in / admin123`);
    console.log(`   Teacher:     vikram.sharma@sarvtralab.in / teacher123`);
    console.log(`   HelpSupport: support.rahul@sarvtralab.in / support123`);

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
