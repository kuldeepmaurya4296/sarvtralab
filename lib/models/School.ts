
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISchool extends Document {
    id: string; // Custom human-readable ID like sch-123
    name: string;
    email: string;
    schoolCode: string;
    principalName: string;
    schoolType: 'government' | 'private' | 'aided';
    board: 'CBSE' | 'ICSE' | 'State Board';
    totalStudents: number;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    websiteUrl?: string;
    subscriptionPlan: string;
    subscriptionExpiry: string;
    assignedCourses: string[]; // Still keep course IDs or convert to ObjectIds? 
    // Usually courses are platform-wide but assigned to schools.
    createdAt: string;
}

const SchoolSchema = new Schema<ISchool>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    schoolCode: { type: String, required: true, unique: true },
    principalName: { type: String, required: true },
    schoolType: { type: String, enum: ['government', 'private', 'aided'], required: true },
    board: { type: String, enum: ['CBSE', 'ICSE', 'State Board'], required: true },
    totalStudents: { type: Number, default: 0 },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    websiteUrl: { type: String },
    subscriptionPlan: { type: String, default: 'Basic' },
    subscriptionExpiry: { type: String },
    assignedCourses: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() }
}, {
    timestamps: true
});

const School: Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
export default School;
