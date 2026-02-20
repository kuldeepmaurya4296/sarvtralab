
'use server';

import connectToDatabase from '@/lib/mongoose';
import Certificate from '@/lib/models/Certificate';
import { Certificate as CertificateType } from '@/data/certificates';

import { clean } from '@/lib/utils';

const scrubCertificate = (doc: any) => {
    const obj = clean(doc);
    if (obj) {
        delete obj._id;
        delete obj.__v;
    }
    return obj;
}

export async function getAllCertificates(): Promise<CertificateType[]> {
    await connectToDatabase();
    const certs = await Certificate.find({}).lean();
    return certs.map(scrubCertificate) as CertificateType[];
}

export async function getStudentCertificates(studentId: string): Promise<CertificateType[]> {
    await connectToDatabase();
    const certs = await Certificate.find({ studentId }).lean();
    return certs.map(scrubCertificate) as CertificateType[];
}

export async function getCertificateCount(studentId: string): Promise<number> {
    await connectToDatabase();
    return await Certificate.countDocuments({ studentId });
}

export async function issueCertificate(data: { studentId: string, courseId: string, issueDate: string }): Promise<CertificateType | null> {
    await connectToDatabase();
    try {
        const id = `cert-${Date.now()}`;
        const newCert = await Certificate.create({
            ...data,
            id,
            certificateId: id, // Using same for now
            grade: 'A', // Default or calculate
            comments: 'Outstanding Performance'
        });
        return scrubCertificate(newCert.toObject()) as CertificateType;
    } catch (e) {
        console.error("Issue Certificate Error:", e);
        return null; // Return null on error, caller handles it
    }
}
