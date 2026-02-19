
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../lib/models/User';
import Course from '../lib/models/Course';
import Certificate from '../lib/models/Certificate';
import Material from '../lib/models/Material';
import Report from '../lib/models/Report';
import { LibraryFolder, LibraryContent } from '../lib/models/Library';

import {
    mockStudents,
    mockSchools,
    mockGovtOrgs,
    mockTeachers,
    mockHelpSupport,
    mockSuperAdmin
} from '../data/users';
import { courses } from '../data/courses';
import { mockIssuedCertificates } from '../data/certificates';
import { materials } from '../data/materials';
import { mockReports } from '../data/reports';

const MONGODB_URI = "mongodb+srv://sarvtra_labs:kdbruWx8V7FVe88q@cluster0.hqcptct.mongodb.net/?appName=Cluster0";

async function seed() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Certificate.deleteMany({});
        await Material.deleteMany({});
        await Report.deleteMany({});
        console.log('Cleared existing data');

        // Seed Users
        const users = [
            ...mockStudents,
            ...mockSchools,
            ...mockGovtOrgs,
            ...mockTeachers,
            ...mockHelpSupport,
            mockSuperAdmin
        ];

        await User.insertMany(users);
        console.log(`Seeded ${users.length} users`);

        // Seed Courses
        await Course.insertMany(courses);
        console.log(`Seeded ${courses.length} courses`);

        // Seed Certificates
        await Certificate.insertMany(mockIssuedCertificates);
        console.log(`Seeded ${mockIssuedCertificates.length} certificates`);

        // Seed Materials
        await Material.insertMany(materials);
        console.log(`Seeded ${materials.length} materials`);

        // Seed Reports
        await Report.insertMany(mockReports);
        console.log(`Seeded ${mockReports.length} reports`);

        // Seed Library
        const libraryData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'library.json'), 'utf-8'));
        await LibraryFolder.deleteMany({});
        await LibraryContent.deleteMany({});

        if (libraryData.folders && libraryData.folders.length > 0) {
            await LibraryFolder.insertMany(libraryData.folders);
            console.log(`Seeded ${libraryData.folders.length} library folders`);
        }

        if (libraryData.content && libraryData.content.length > 0) {
            await LibraryContent.insertMany(libraryData.content);
            console.log(`Seeded ${libraryData.content.length} library content items`);
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
