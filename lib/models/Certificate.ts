
import mongoose, { Schema, Model } from 'mongoose';

const CertificateSchema = new Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    courseId: String,
    issueDate: String,
    hash: String,
    downloadUrl: String,
    status: { type: String, enum: ['issued', 'revoked'], default: 'issued' }
}, {
    timestamps: true
});

const Certificate: Model<any> = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
export default Certificate;
