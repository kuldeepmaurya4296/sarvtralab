/**
 * Master Seed Script: Re-initializes the entire demo environment.
 * Clears Users, Schools, Courses, and Enrollments.
 * Ensures consistent IDs and relational data.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvtra_labs:kdbruWx8V7FVe88q@cluster0.hqcptct.mongodb.net/?appName=Cluster0';

// Define Schemas for raw access (avoiding import issues)
const UserSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String },
    name: { type: String },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    schoolName: { type: String },
    enrolledCourses: [String],
    completedCourses: [String],
}, { strict: false });

const SchoolSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    email: { type: String }
}, { strict: false });

const CourseSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String },
    curriculum: [mongoose.Schema.Types.Mixed]
}, { strict: false });

const EnrollmentSchema = new mongoose.Schema({
    student: { type: String, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    status: { type: String, default: 'Active' },
    progress: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const School = mongoose.models.School || mongoose.model('School', SchoolSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);

async function seed() {
    console.log('🌱 Starting Master Seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
        User.deleteMany({}),
        School.deleteMany({}),
        Course.deleteMany({}),
        Enrollment.deleteMany({})
    ]);
    console.log('✅ Done!\n');

    const hashedPassword = await bcrypt.hash('student123', 10);
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    const schoolHashedPassword = await bcrypt.hash('school123', 10);
    const teacherHashedPassword = await bcrypt.hash('teacher123', 10);
    const govtHashedPassword = await bcrypt.hash('govt123', 10);
    const supportHashedPassword = await bcrypt.hash('support123', 10);

    // 1. Create School
    console.log('🏫 Creating Schools...');
    const dps = await School.create({
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
        createdAt: new Date().toISOString()
    });

    // 2. Create Course with proper curriculum
    console.log('📚 Creating Courses...');
    const coursesData = [
        {
            id: 'crs-001',
            title: 'Foundation Maker Track - 3 Months',
            description: 'Introduction to robotics and coding for young minds. Learn block programming, basic electronics, and build your first robot!',
            grade: 'Class 4-6',
            duration: '3 Months',
            sessions: 24,
            totalHours: 36,
            price: 15999,
            originalPrice: 24999,
            emiAvailable: true,
            emiAmount: 5333,
            emiMonths: 3,
            image: '/robotics-illustration.jpg',
            category: 'foundation',
            level: 'Beginner',
            schoolId: dps._id,
            tags: ['Block Programming', 'Electronics', 'CBSE Aligned'],
            features: ['CBSE Aligned', 'Robotics Kit Included', '24 Live Sessions'],
            rating: 4.8,
            studentsEnrolled: 2450,
            curriculum: [
                {
                    id: 'fm-1',
                    title: 'Introduction to Robotics',
                    duration: '6 Hours',
                    lessons: [
                        { id: 'fm-1-1', title: 'What is a Robot?', duration: '45 min', type: 'video' },
                        { id: 'fm-1-2', title: 'History of Robotics', duration: '30 min', type: 'video' }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 'crs-002',
            title: 'Intermediate Robotics Track - 3 Months',
            description: 'Take your robotics skills to the next level with Python programming, advanced sensors, and IoT projects.',
            grade: 'Class 7-10',
            duration: '3 Months',
            sessions: 24,
            totalHours: 36,
            price: 19999,
            originalPrice: 32999,
            emiAvailable: true,
            emiAmount: 6666,
            emiMonths: 3,
            image: '/robotics-illustration.jpg',
            category: 'intermediate',
            level: 'Intermediate',
            schoolId: dps._id,
            tags: ['Python', 'IoT', 'Sensors'],
            features: ['Python Programming', 'Advanced Sensors', 'Industry Mentorship'],
            rating: 4.7,
            studentsEnrolled: 1650,
            curriculum: [
                {
                    id: 'im-1',
                    title: 'Python for Robotics',
                    duration: '12 Hours',
                    lessons: [
                        { id: 'im-1-1', title: 'Python Fundamentals', duration: '90 min', type: 'video' }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 'crs-003',
            title: 'Advanced Pre-Engineering - 3 Months',
            description: 'Industry-level robotics training with ROS, Computer Vision, and industrial automation concepts.',
            grade: 'Class 11-12',
            duration: '3 Months',
            sessions: 24,
            totalHours: 36,
            price: 24999,
            originalPrice: 39999,
            emiAvailable: true,
            emiAmount: 8333,
            emiMonths: 3,
            image: '/robotics-illustration.jpg',
            category: 'advanced',
            level: 'Advanced',
            schoolId: dps._id,
            tags: ['ROS', 'Computer Vision', 'AI/ML'],
            features: ['ROS Framework', 'OpenCV Vision', 'Research Guidance'],
            rating: 4.9,
            studentsEnrolled: 890,
            curriculum: [
                {
                    id: 'ad-1',
                    title: 'ROS Fundamentals',
                    duration: '12 Hours',
                    lessons: [
                        { id: 'ad-1-1', title: 'Introduction to ROS', duration: '90 min', type: 'video' }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 'crs-004',
            title: 'Advanced Pre-Engineering - 9 Months',
            description: 'Complete pre-engineering program preparing students for top engineering colleges and robotics careers.',
            grade: 'Class 11-12',
            duration: '9 Months',
            sessions: 72,
            totalHours: 108,
            price: 59999,
            originalPrice: 89999,
            emiAvailable: true,
            emiAmount: 6666,
            emiMonths: 9,
            image: '/robotics-illustration.jpg',
            category: 'advanced',
            level: 'Advanced',
            schoolId: dps._id,
            tags: ['Research', 'Deep Learning', 'Certification'],
            features: ['Guaranteed Internship', 'Certification', 'Alumni Network'],
            rating: 4.9,
            studentsEnrolled: 450,
            curriculum: [
                {
                    id: 'ad-long-1',
                    title: 'Deep Learning for Robotics',
                    duration: '20 Hours',
                    lessons: [
                        { id: 'ad-l-1', title: 'Neural Networks', duration: '120 min', type: 'video' }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        }
    ];

    const courses = await Course.create(coursesData);
    const crs001 = courses[0];
    const crs002 = courses[1];

    // 3. Create Users
    console.log('👤 Creating Users...');

    // SuperAdmin
    await User.create({
        id: 'admin-001',
        email: 'superadmin@sarvtralab.in',
        password: adminHashedPassword,
        role: 'superadmin',
        name: 'System Administrator',
        permissions: ['all'],
        createdAt: new Date().toISOString()
    });

    // School Admin
    await User.create({
        id: 'usr-sch-001',
        email: 'admin@dpsnoida.edu.in',
        password: schoolHashedPassword,
        role: 'school',
        name: 'DPS Admin',
        schoolId: dps._id,
        schoolName: dps.name,
        createdAt: new Date().toISOString()
    });

    // Teacher
    await User.create({
        id: 'tch-001',
        email: 'vikram.sharma@sarvtralab.in',
        password: teacherHashedPassword,
        role: 'teacher',
        name: 'Vikram Sharma',
        schoolId: dps._id,
        schoolName: dps.name,
        specialization: 'Robotics & Electronics',
        createdAt: new Date().toISOString()
    });

    // Student (Arjun Patel)
    const arjun = await User.create({
        id: 'std-001',
        email: 'arjun.patel@student.sarvtralab.in',
        password: hashedPassword, // student123
        role: 'student',
        name: 'Arjun Patel',
        schoolId: dps._id,
        schoolName: dps.name,
        grade: 'Class 6',
        enrolledCourses: ['crs-001'], // MATCHING COURSE ID
        completedCourses: [],
        createdAt: '2025-01-15'
    });

    // 4. Create proper Enrollment record
    console.log('📝 Creating Enrollments...');
    await Enrollment.create([
        {
            student: arjun.id,
            course: crs001._id,
            status: 'Active',
            progress: 10,
            enrolledAt: new Date()
        },
        {
            student: arjun.id,
            course: crs002._id,
            status: 'Active',
            progress: 0,
            enrolledAt: new Date()
        }
    ]);

    // Govt Org
    await User.create({
        id: 'gov-001',
        email: 'director@education.gov.in',
        password: govtHashedPassword,
        role: 'govt',
        name: 'Shri Ramesh Chandra',
        organizationName: 'Ministry of Education',
        status: 'active',
        createdAt: '2024-01-01'
    });

    // Help Support
    await User.create({
        id: 'help-001',
        email: 'support.rahul@sarvtralab.in',
        password: supportHashedPassword,
        role: 'helpsupport',
        name: 'Rahul Gupta',
        department: 'technical',
        status: 'available',
        createdAt: '2024-03-01'
    });

    console.log('\n========================================');
    console.log('✅ Master Seeding Completed Successfully!');
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
