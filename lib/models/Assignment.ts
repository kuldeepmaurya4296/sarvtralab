import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    description: string;
    course: mongoose.Types.ObjectId;
    module?: string; // Optional reference to module ID
    dueDate: Date;
    maxScore: number;
    published: boolean;
}

const AssignmentSchema = new Schema<IAssignment>({
    title: { type: String, required: true },
    description: { type: String },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    module: { type: String },
    dueDate: { type: Date, required: true },
    maxScore: { type: Number, default: 100 },
    published: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export default Assignment;
