
import mongoose, { Schema, Model } from 'mongoose';

const ReportSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    type: String,
    generatedBy: String,
    generatedAt: String,
    status: { type: String, enum: ['Ready', 'Processing', 'Failed'] },
    size: String,
    description: String,
    schoolId: String
}, {
    timestamps: true
});

const Report: Model<any> = mongoose.models.Report || mongoose.model('Report', ReportSchema);
export default Report;
