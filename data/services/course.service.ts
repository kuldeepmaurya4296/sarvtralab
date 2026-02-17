
import { db } from './database';
import { Course } from '@/data/courses';

export const CourseService = {
    getAll: (): Course[] => {
        return db.courses.find();
    },

    getById: (id: string) => {
        return db.courses.findById(id);
    },

    create: (course: Omit<Course, 'id'>) => {
        return db.courses.insertOne(course as any);
    },

    update: (id: string, updates: Partial<Course>) => {
        return db.courses.updateOne(id, updates);
    },

    delete: (id: string) => {
        return db.courses.deleteOne(id);
    },

    getByCategory: (category: string) => {
        return db.courses.find({ category } as Partial<Course>);
    },

    getEnrolledCount: (courseId: string) => {
        const course = db.courses.findById(courseId);
        return course?.studentsEnrolled || 0;
    }
};
