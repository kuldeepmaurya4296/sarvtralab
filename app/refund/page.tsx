'use client';
import PublicLayout from '@/components/layout/PublicLayout';

export default function RefundPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-32">
                <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
                <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                    <p>At Sarvtra Labs, we strive to ensure our customers are satisfied with their purchases. Please read our refund policy carefully.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Course Refunds</h2>
                    <p>We offer a full money-back guarantee for all purchases made on our website. If you are not satisfied with the course that you have purchased from us, you can get your money back no questions asked.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Eligibility</h2>
                    <p>You are eligible for a full reimbursement within 14 calendar days of your purchase. After the 14-day period you will no longer be eligible and won&apos;t be able to receive a refund.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Processing Time</h2>
                    <p>If you have any additional questions or would like to request a refund, feel free to contact us. Refunds are typically processed within 5-7 business days.</p>
                </div>
            </div>
        </PublicLayout>
    );
}
