
import { db } from './database';
import { GovtOrg } from '@/data/users';

export const GovtService = {
    getAll: () => {
        return db.govt.find();
    },

    getById: (id: string) => {
        return db.govt.findById(id);
    },

    create: (org: Omit<GovtOrg, 'id'>) => {
        return db.govt.insertOne(org as any);
    },

    update: (id: string, updates: Partial<GovtOrg>) => {
        return db.govt.updateOne(id, updates);
    },

    delete: (id: string) => {
        return db.govt.deleteOne(id);
    }
};
