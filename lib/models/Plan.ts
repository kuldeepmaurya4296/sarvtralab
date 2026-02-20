import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPlan extends Document {
    id: string;
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    popular: boolean;
    type: 'school' | 'individual'; // For future flexibility
    status: 'active' | 'inactive';
}

const PlanSchema = new Schema<IPlan>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    type: { type: String, enum: ['school', 'individual'], default: 'school' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
    timestamps: true
});

const Plan: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
export default Plan;
