import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAttendance extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    date: Date;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    sessionInfo?: string; // e.g., "Lecture 1"
}

const AttendanceSchema = new Schema<IAttendance>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        default: 'Absent'
    },
    sessionInfo: { type: String }
}, {
    timestamps: true
});

// Unique attendance record per student per course per day
AttendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;
