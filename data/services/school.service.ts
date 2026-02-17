
import { db } from './database';
import { School } from '@/data/users';

export const SchoolService = {
    getAll: () => {
        return db.schools.find();
    },

    getById: (id: string) => {
        return db.schools.findById(id);
    },

    create: (school: Omit<School, 'id'>) => {
        return db.schools.insertOne(school as any);
    },

    update: (id: string, updates: Partial<School>) => {
        return db.schools.updateOne(id, updates);
    },

    delete: (id: string) => {
        return db.schools.deleteOne(id);
    },

    updateAccess: (id: string, accessData: any) => {
        return db.schools.updateOne(id, { ...accessData });
    },

    getStats: (schoolId: string) => {
        const school = db.schools.findById(schoolId);
        // Deterministic random for stats based on ID to avoid hydration issues
        const seed = schoolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rand = (min: number, max: number) => min + (seed % (max - min + 1));

        return {
            studentCount: school?.totalStudents || 0,
            activeCourses: rand(5, 25),
            teacherCount: rand(10, 60),
            attendanceRate: rand(85, 98)
        };
    }
};
