import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPayment extends Document {
    user: string;
    enrollment?: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
    method: 'Stripe' | 'PayPal' | 'Razorpay' | 'Bank Transfer';
    transactionId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    user: { type: String, required: true }, // Changed from ObjectId to String to match User schema (usr-...)
    enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
        index: true
    },
    method: { type: String, required: true },
    transactionId: { type: String }, // Can be Razorpay Payment ID
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
}, {
    timestamps: true
});

// Prevent model overwrite in development, but FORCE schema refresh if structure changed
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Payment) {
        delete mongoose.models.Payment;
    }
}

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
