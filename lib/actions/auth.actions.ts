'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function registerUser(data: any) {
    await connectToDatabase();
    try {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return { error: 'User already exists' };
        }

        let schoolId = data.schoolId || '';
        let schoolName = data.schoolName || '';

        if (data.createNewSchool && data.newSchoolName && data.newSchoolEmail) {
            const existingSchool = await User.findOne({ email: data.newSchoolEmail });
            if (existingSchool) {
                return { error: `School with email ${data.newSchoolEmail} already exists.` };
            }

            const schoolPassword = await bcrypt.hash('school123', 10);
            const newSchool = await User.create({
                id: `sch-${Date.now()}`,
                name: data.newSchoolName,
                email: data.newSchoolEmail,
                password: schoolPassword,
                role: 'school',
                schoolName: data.newSchoolName,
                schoolCode: `CODE-${Date.now().toString().slice(-6)}`,
                principalName: 'Principal Name',
                schoolType: 'private',
                board: 'CBSE',
                address: 'Address not provided',
                city: 'City',
                state: 'State',
                pincode: '000000',
                phone: '0000000000',
                assignedCourses: [],
                status: 'active',
                subscriptionPlan: 'basic',
                createdAt: new Date().toISOString()
            });

            schoolId = newSchool.id;
            schoolName = newSchool.name;
        } else if (schoolId === 'no_school') {
            schoolId = ''; // Clear schoolId to store as undefined
            schoolName = schoolName || 'Independent Learner';
        } else if (schoolId && !schoolName) {
            // Look up the school name from the ID
            const school = await User.findOne({ id: schoolId, role: 'school' }).lean();
            if (school) schoolName = (school as any).name;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await User.create({
            ...data,
            id: `usr-${Date.now()}`,
            password: hashedPassword,
            role: data.role || 'student',
            schoolId: schoolId || undefined,
            schoolName: schoolName || undefined,
            createdAt: new Date().toISOString()
        });

        const { password, _id, __v, ...userWithoutPassword } = newUser.toObject();
        return { user: { ...userWithoutPassword, id: newUser.id, _id: (_id as any).toString() } };
    } catch (error: any) {
        console.error("Register Error:", error);
        return { error: error.message || 'Registration failed' };
    }
}


export async function loginUser(email: string, pass: string): Promise<any | null> {
    await connectToDatabase();

    try {
        const user = await User.findOne({ email }).lean();

        if (user && await bcrypt.compare(pass, user.password)) {
            // Convert _id to string or remove it if not needed in client
            const { _id, password, ...rest } = user;
            return { ...rest, id: user.id }; // Ensure 'id' is present
        }
        return null; // Invalid credentials
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
}
