
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IActivityLog extends Document {
    user: string; // usr-id
    userRole: string;
    action: string; // e.g., 'LOGIN', 'COURSE_CREATE', 'PAYMENT_SUCCESS', 'ASSIGNMENT_SUBMIT'
    details: string;
    entityType?: string; // e.g., 'Course', 'User', 'Payment'
    entityId?: string;
    ipAddress?: string;
    timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
    user: { type: String, required: true, index: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    details: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: String },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
