
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { UserRole } from '@/data/users';

export async function loginUser(email: string, pass: string): Promise<any | null> {
    await connectToDatabase();

    // Find user by email and password
    // In a real app, password should be hashed. Here we are using plain text as per existing mock data.
    try {
        const user = await User.findOne({ email, password: pass }).lean();

        if (user) {
            // Convert _id to string or remove it if not needed in client
            const { _id, ...rest } = user;
            return { ...rest, id: user.id }; // Ensure 'id' is present
        }
        return null;
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
}
