import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    source: string;
    status: 'New' | 'Contacted' | 'Interested' | 'Qualified' | 'Converted' | 'Lost';
    assignedTo?: mongoose.Types.ObjectId; // User (Admin/Staff)
    notes?: string;
    lastContactedAt?: Date;
    convertedToUser?: mongoose.Types.ObjectId; // If converted
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    source: { type: String, default: 'Organic' },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Interested', 'Qualified', 'Converted', 'Lost'],
        default: 'New',
        index: true
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    lastContactedAt: { type: Date },
    convertedToUser: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

// Indexing for search and filtering
LeadSchema.index({ email: 1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ createdAt: -1 });

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
export default Lead;
