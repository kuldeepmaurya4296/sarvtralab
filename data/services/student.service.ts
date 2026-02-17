
import { db } from './database';
import { Student } from '@/data/users';

// Simulating database operations using the UDBS cluster
export const StudentService = {
    getAll: () => {
        return db.students.find();
    },

    getById: (id: string, populate: boolean = false) => {
        const student = db.students.findById(id);
        if (student && populate) {
            return db.populate(student, ['school']);
        }
        return student;
    },

    create: (student: Omit<Student, 'id'>) => {
        return db.students.insertOne(student as any);
    },

    update: (id: string, updates: Partial<Student>) => {
        return db.students.updateOne(id, updates);
    },

    delete: (id: string) => {
        return db.students.deleteOne(id);
    },

    // Specialized queries
    getPerformance: (studentId: string) => {
        // Deterministic random based on ID char codes to prevent hydration issues
        const seed = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rand = (min: number, max: number) => min + (seed % (max - min + 1));

        return {
            attendance: Math.min(100, Math.max(70, rand(75, 98))),
            lecturesAttended: rand(40, 58),
            totalLectures: 60,
            timeSpent: `${rand(80, 150)}h ${rand(10, 50)}m`,
            avgScore: Math.min(100, rand(70, 95)),
            assignmentsCompleted: rand(15, 20),
            totalAssignments: 20,
            recentScores: [
                { subject: "Mathematics", score: rand(80, 98), date: "2024-02-15", type: "Quiz" },
                { subject: "Science", score: rand(75, 92), date: "2024-02-12", type: "Lab Report" },
                { subject: "History", score: rand(85, 95), date: "2024-02-10", type: "Essay" },
                { subject: "English", score: rand(78, 90), date: "2024-02-08", type: "Test" },
            ],
            monthlyActivity: [
                rand(40, 60), rand(50, 70), rand(60, 80), rand(70, 90), rand(80, 100), rand(75, 95)
            ]
        };
    },

    getCertificates: (studentId: string) => {
        const certs = db.certificates.find({ studentId });
        return certs.map(cert => db.populate(cert, ['course']));
    },

    getSchoolName: (schoolId: string) => {
        const school = db.schools.findById(schoolId);
        return school ? school.name : 'Unknown School';
    },

    getSchools: () => {
        return db.schools.find();
    }
};
