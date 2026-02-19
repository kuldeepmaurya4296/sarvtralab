
import mongoose, { Schema, Model } from 'mongoose';

const MaterialSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    type: { type: String, enum: ['pdf', 'video', 'link', 'zip'] },
    size: String,
    courseId: String,
    moduleId: String,
    downloadUrl: String,
    uploadedAt: String,
    description: String
}, {
    timestamps: true
});

const Material: Model<any> = mongoose.models.Material || mongoose.model('Material', MaterialSchema);
export default Material;
