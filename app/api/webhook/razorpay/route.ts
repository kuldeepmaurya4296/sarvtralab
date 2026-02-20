
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongoose';
import { verifyPayment } from '@/lib/actions/payment.actions';

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
        return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(payload)
        .digest('hex');

    if (expectedSignature !== signature) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);
    console.log("Razorpay Webhook Event:", event.event);

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;
        const { order_id, id: payment_id, notes } = payment;

        // Notes should contain userId, itemId, itemType, amount passed from client
        const { userId, itemId, itemType, amount } = notes;

        try {
            await verifyPayment(
                order_id,
                payment_id,
                '', // Signature check already done by webhook signature
                userId,
                itemId,
                itemType,
                amount
            );
            return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
        } catch (error) {
            console.error("Webhook verifyPayment error:", error);
            return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
}
