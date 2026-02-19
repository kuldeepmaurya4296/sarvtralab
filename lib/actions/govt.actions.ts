
'use server';

import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/User';
import { GovtOrg } from '@/data/users';
import bcrypt from 'bcryptjs';

const clean = (doc: any) => {
    if (!doc) return null;
    const obj = JSON.parse(JSON.stringify(doc));
    delete obj._id;
    delete obj.password;
    delete obj.__v;
    return obj;
}

export async function getAllGovtOrgs(): Promise<GovtOrg[]> {
    await connectToDatabase();
    const orgs = await User.find({ role: 'govt' }).lean();
    return orgs.map(clean) as GovtOrg[];
}

export async function getGovtOrgById(id: string): Promise<GovtOrg | null> {
    await connectToDatabase();
    const org = await User.findOne({ id, role: 'govt' }).lean();
    return clean(org) as GovtOrg | null;
}

export async function createGovtOrg(data: Partial<GovtOrg>): Promise<GovtOrg | null> {
    await connectToDatabase();
    try {
        const id = `gov-${Date.now()}`;
        const hashedPassword = await bcrypt.hash(data.password || 'govt123', 10);

        const newOrg = await User.create({
            ...data,
            id,
            password: hashedPassword,
            role: 'govt',
            assignedSchools: [],
            createdAt: new Date().toISOString()
        });
        return clean(newOrg.toObject()) as GovtOrg;
    } catch (e) {
        console.error("Create Govt Org Error:", e);
        return null;
    }
}

export async function updateGovtOrg(id: string, updates: Partial<GovtOrg>): Promise<GovtOrg | null> {
    await connectToDatabase();
    try {
        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updated = await User.findOneAndUpdate(
            { id, role: 'govt' },
            { $set: updates },
            { new: true }
        ).lean();
        return clean(updated) as GovtOrg | null;
    } catch (e) {
        console.error("Update Govt Org Error:", e);
        return null;
    }
}

export async function deleteGovtOrg(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
        const res = await User.deleteOne({ id, role: 'govt' });
        return res.deletedCount === 1;
    } catch (e) {
        console.error("Delete Govt Org Error:", e);
        return false;
    }
}
