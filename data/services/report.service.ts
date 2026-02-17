
import { db } from './database';
import { Report } from '../reports';

export const ReportService = {
    getAll: () => {
        return db.reports.find();
    },

    getBySchool: (schoolId: string) => {
        return db.reports.find({ schoolId });
    },

    generate: (data: Omit<Report, 'id' | 'generatedAt' | 'status'>) => {
        return db.reports.insertOne({
            ...data,
            status: 'Processing',
            size: '-'
        } as any);
    },

    update: (id: string, updates: Partial<Report>) => {
        return db.reports.updateOne(id, updates);
    },

    delete: (id: string) => {
        return db.reports.deleteOne(id);
    }
};
