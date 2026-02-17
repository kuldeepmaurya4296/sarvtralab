
// This is the core Database Driver for our simulated MongoDB cluster
// It provides a standard interface for all "Collections" in the data folder

export interface QueryOptions {
    populate?: string[];
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
}

export class Collection<T extends { id: string }> {
    private name: string;
    private data: T[];

    constructor(name: string, initialData: T[]) {
        this.name = name;
        this.data = JSON.parse(JSON.stringify(initialData)); // Deep copy to simulate DB isolation
    }

    find(query: Partial<T> | ((item: T) => boolean) = {}, options: QueryOptions = {}): T[] {
        let results = [...this.data];

        // Apply Query
        if (typeof query === 'function') {
            results = results.filter(query);
        } else {
            results = results.filter(item => {
                return Object.entries(query).every(([key, value]) => (item as any)[key] === value);
            });
        }

        // Apply Logic for "limit", "skip", etc.
        if (options.skip) results = results.slice(options.skip);
        if (options.limit) results = results.slice(0, options.limit);

        return results;
    }

    findOne(query: Partial<T> | ((item: T) => boolean)): T | null {
        const results = this.find(query, { limit: 1 });
        return results.length > 0 ? results[0] : null;
    }

    findById(id: string): T | null {
        return this.findOne({ id } as Partial<T>);
    }

    insertOne(doc: Omit<T, 'id'> & { id?: string }): T {
        const newDoc = {
            ...doc,
            id: doc.id || `${this.name.toLowerCase().substring(0, 3)}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: (doc as any).createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as unknown as T;
        this.data.push(newDoc);
        return newDoc;
    }

    updateOne(id: string, updates: Partial<T>): T | null {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.data[index] = {
            ...this.data[index],
            ...updates,
            updatedAt: new Date().toISOString()
        } as unknown as T;
        return this.data[index];
    }

    deleteOne(id: string): boolean {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) return false;
        this.data.splice(index, 1);
        return true;
    }

    count(query: Partial<T> | ((item: T) => boolean) = {}): number {
        return this.find(query).length;
    }
}

// Global Cluster Instance
import { mockStudents, mockSchools, mockTeachers, mockGovtOrgs, mockHelpSupport } from '../users';
import { courses } from '../courses';
import { mockIssuedCertificates } from '../certificates';
import { materials } from '../materials';

import { mockReports } from '../reports';

class MongoDBCluster {
    students = new Collection('Students', mockStudents);
    schools = new Collection('Schools', mockSchools);
    teachers = new Collection('Teachers', mockTeachers);
    govt = new Collection('GovtOrgs', mockGovtOrgs);
    support = new Collection('Support', mockHelpSupport);
    courses = new Collection('Courses', courses);
    certificates = new Collection('Certificates', mockIssuedCertificates);
    materials = new Collection('Materials', materials);
    reports = new Collection('Reports', mockReports);

    // Cross-collection helper
    populate(doc: any, fields: string[]) {
        if (!doc) return doc;
        const populated = { ...doc };

        fields.forEach(field => {
            if (field === 'school' && doc.schoolId) {
                populated.school = this.schools.findById(doc.schoolId);
            }
            if (field === 'student' && doc.studentId) {
                populated.student = this.students.findById(doc.studentId);
            }
            if (field === 'course' && doc.courseId) {
                populated.course = this.courses.findById(doc.courseId);
            }
        });

        return populated;
    }
}

export const db = new MongoDBCluster();
