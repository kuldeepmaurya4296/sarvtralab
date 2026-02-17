
import { db } from './database';

export const CertificateService = {
    getAll: () => {
        return db.certificates.find();
    },

    getById: (id: string) => {
        return db.certificates.findById(id);
    },

    getByStudent: (studentId: string) => {
        return db.certificates.find({ studentId });
    },

    issue: (data: { studentId: string; courseId: string; issueDate?: string }) => {
        // Deterministic certificate ID based on year and student info if needed
        const year = new Date().getFullYear();
        const randPart = Math.random().toString(36).substring(7).toUpperCase();
        const id = `CERT-${year}-${randPart}`;

        return db.certificates.insertOne({
            ...data,
            id,
            hash: Math.random().toString(36).substring(7),
            downloadUrl: '#'
        } as any);
    }
};
