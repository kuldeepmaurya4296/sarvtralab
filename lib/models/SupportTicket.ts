import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISupportTicket extends Document {
    ticketId: string; // User-facing ID (e.g., TKT-1001)
    user: mongoose.Types.ObjectId;
    subject: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    assignedTo?: mongoose.Types.ObjectId;
    messages: Array<{
        sender: mongoose.Types.ObjectId;
        message: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
    ticketId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open',
        index: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [{
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const SupportTicket: Model<ISupportTicket> = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
export default SupportTicket;
