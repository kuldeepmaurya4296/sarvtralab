import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISubmission extends Document {
    assignment: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    content: string; // URL or text
    submittedAt: Date;
    score?: number;
    feedback?: string;
    status: 'Submitted' | 'Graded' | 'Late';
}

const SubmissionSchema = new Schema<ISubmission>({
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String },
    submittedAt: { type: Date, default: Date.now },
    score: { type: Number },
    feedback: { type: String },
    status: {
        type: String,
        enum: ['Submitted', 'Graded', 'Late'],
        default: 'Submitted'
    }
}, {
    timestamps: true
});

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export default Submission;
