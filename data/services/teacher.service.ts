
import { db } from './database';
import { Teacher } from '@/data/users';

export const TeacherService = {
    getAll: () => {
        return db.teachers.find();
    },

    getById: (id: string) => {
        return db.teachers.findById(id);
    },

    create: (teacher: Omit<Teacher, 'id'>) => {
        return db.teachers.insertOne(teacher as any);
    },

    update: (id: string, updates: Partial<Teacher>) => {
        return db.teachers.updateOne(id, updates);
    },

    delete: (id: string) => {
        return db.teachers.deleteOne(id);
    },

    getSchoolNames: (schoolIds: string[]) => {
        if (!schoolIds || !Array.isArray(schoolIds)) return '';
        return db.schools
            .find(s => schoolIds.includes(s.id))
            .map(s => s.name)
            .join(', ');
    },

    getSchools: () => {
        return db.schools.find();
    },

    assignSchools: (teacherId: string, schoolIds: string[]) => {
        return db.teachers.updateOne(teacherId, { assignedSchools: schoolIds });
    }
};
