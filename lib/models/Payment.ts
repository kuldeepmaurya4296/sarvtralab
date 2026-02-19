import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    enrollment?: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
    method: 'Stripe' | 'PayPal' | 'Razorpay' | 'Bank Transfer';
    transactionId: string;
    createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
        index: true
    },
    method: { type: String, required: true },
    transactionId: { type: String, unique: true }
}, {
    timestamps: true
});

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
