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

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await User.create({
            ...data,
            id: `usr-${Date.now()}`,
            password: hashedPassword,
            role: data.role || 'student',
            createdAt: new Date().toISOString()
        });

        const { password, ...userWithoutPassword } = newUser.toObject();
        return { user: { ...userWithoutPassword, id: newUser.id } };
    } catch (error) {
        console.error("Register Error:", error);
        return { error: 'Registration failed' };
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
