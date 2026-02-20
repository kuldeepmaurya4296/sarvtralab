'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongoose';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import Enrollment from '@/lib/models/Enrollment';
import { revalidatePath } from 'next/cache';
import { logActivity, sendNotification } from './activity.actions';
import { clean } from '@/lib/utils';

// Removed top-level instance instantiation to prevent build/runtime errors if env vars are missing at module load time.

export async function createRazorpayOrder(amount: number, currency: string = 'INR', receipt: string, notes?: any) {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay credentials are not set in environment variables.");
    }

    const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency,
        receipt,
        notes,
    };

    try {
        const order = await instance.orders.create(options);
        // Serialize the order object to ensure it can be passed to client components
        return clean(order);
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        throw new Error("Failed to create Razorpay order");
    }
}

export async function verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    userId: string,
    itemId: string,
    itemType: string,
    amount: number
) {
    await connectToDatabase();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    let isAuthentic = false;
    if (razorpay_signature === '') {
        // Internal call from webhook which already verified its signature
        isAuthentic = true;
    } else {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');
        isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
        try {
            console.log("Starting Payment Record Creation...");
            // 1. Create Payment Record
            const newPayment = await Payment.create({
                user: userId,
                amount: amount,
                currency: 'INR',
                status: 'Completed',
                method: 'Razorpay',
                transactionId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            });
            console.log("Payment Record Created:", newPayment._id);

            if (itemType === 'course') {
                console.log(`Processing Course Enrollment: ${itemId} for User: ${userId}`);
                // 2. Enrollment Logic for Course
                const course = await Course.findOne({ id: itemId });

                if (course) {
                    console.log("Course Found:", course.title);
                    const existingEnrollment = await Enrollment.findOne({
                        student: userId,
                        course: course._id
                    });

                    if (!existingEnrollment) {
                        console.log("Creating New Enrollment...");
                        const newEnrollment = await Enrollment.create({
                            student: userId,
                            course: course._id,
                            enrolledAt: new Date(),
                            status: 'Active',
                            progress: 0,
                            grade: 'N/A'
                        });

                        newPayment.enrollment = newEnrollment._id;
                        await newPayment.save();

                        await User.findOneAndUpdate(
                            { id: userId },
                            { $addToSet: { enrolledCourses: course.id } }
                        );

                        await Course.findOneAndUpdate(
                            { id: itemId },
                            { $inc: { studentsEnrolled: 1 } }
                        );
                        console.log("Enrollment & User Updated Successfully");

                        await logActivity(userId, 'COURSE_ENROLLMENT', `Enrolled in course: ${course.title}`);
                        await sendNotification(userId, 'Course Enrolled!', `You have successfully enrolled in ${course.title}. Start learning now!`, 'success');
                    } else {
                        console.log("User already enrolled. Updating payment ref only.");
                        newPayment.enrollment = existingEnrollment._id;
                        await newPayment.save();
                    }
                } else {
                    console.error("Course NOT found for ID:", itemId);
                }
            } else if (itemType === 'plan') {
                console.log(`Processing Plan Subscription: ${itemId}`);
                // 3. Subscription Logic for Plan
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);

                await User.findOneAndUpdate(
                    { id: userId },
                    {
                        subscriptionPlan: itemId,
                        subscriptionExpiry: expiryDate.toISOString()
                    }
                );
            }

            revalidatePath('/student/dashboard');
            revalidatePath('/courses');
            revalidatePath(`/courses/${itemId}`);
            revalidatePath('/school/dashboard');
            revalidatePath('/admin/dashboard');
            return { success: true, message: "Payment verified successfully" };

        } catch (error) {
            console.error("Database Update Error after Payment:", error);
            // Return specific error message if possible to help debug
            return { success: false, message: `Payment successful but record update failed: ${(error as any).message}` };
        }

    } else {
        return { success: false, message: "Payment verification failed" };
    }
}
