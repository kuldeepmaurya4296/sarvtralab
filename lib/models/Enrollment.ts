import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId; // Actually referencing Course model (via custom ID or ObjectId?) 
    // Given current system uses custom ID strings for courses, we might need to stick to that or migrate.
    // Requirement says "relational referencing usage (via ObjectId)". 
    // I will use ObjectId assuming we can reference the _id of the Course document.

    enrolledAt: Date;
    status: 'Active' | 'Completed' | 'Dropped';
    progress: number; // 0-100
    currentLesson?: string; // ID of current lesson
    grade?: string;
    completionDate?: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    enrolledAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Dropped'],
        default: 'Active'
    },
    progress: { type: Number, default: 0 },
    currentLesson: { type: String },
    grade: { type: String },
    completionDate: { type: Date }
}, {
    timestamps: true
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
