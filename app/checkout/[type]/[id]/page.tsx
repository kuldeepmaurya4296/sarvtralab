
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { createRazorpayOrder, verifyPayment } from '@/lib/actions/payment.actions';
import { getCourseById } from '@/lib/actions/course.actions';

// Mock plans data (should be in a config file)
const PLANS = {
    basic: { id: 'basic', name: 'Basic Plan', price: 4999, features: ['Access to basic courses', 'Certificate of completion'] },
    standard: { id: 'standard', name: 'Standard Plan', price: 9999, features: ['Access to all courses', 'Priority support', 'Mentorship'] },
    premium: { id: 'premium', name: 'Premium Plan', price: 14999, features: ['Lifetime access', '1-on-1 Mentorship', 'Job assistance'] }
};

export default function CheckoutPage() {
    const params = useParams();
    const type = params?.type as string; // 'course' or 'plan'
    const id = params?.id as string;

    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [itemDetails, setItemDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (type === 'plan') {
                const plan = PLANS[id as keyof typeof PLANS];
                if (plan) {
                    setItemDetails(plan);
                } else {
                    toast.error("Plan not found");
                    router.push('/pricing');
                }
                setIsLoading(false);
            } else if (type === 'course') {
                try {
                    const course = await getCourseById(id);
                    if (course) {
                        setItemDetails({
                            id: course.id,
                            name: course.title,
                            price: course.price,
                            features: course.features || ['Full access', 'Certificate', 'Projects']
                        });
                    } else {
                        toast.error("Course not found");
                        router.push('/courses');
                    }
                } catch (e) {
                    console.error(e);
                    toast.error("Error loading course");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (id && type) {
            fetchItemDetails();
        }
    }, [type, id, router]);

    const handlePayment = async () => {
        if (!user) {
            toast.error("Please login to continue");
            router.push('/login?redirect=/checkout/' + type + '/' + id);
            return;
        }

        if (!acceptedTerms) {
            toast.error("Please accept the terms and conditions");
            return;
        }

        setIsProcessing(true);

        try {
            const totalAmount = itemDetails.price * 1.18;
            const paymentNotes = {
                userId: user.id,
                itemId: id,
                itemType: type,
                amount: totalAmount
            };

            // 1. Create Order
            const order = await createRazorpayOrder(totalAmount, 'INR', 'receipt_' + Date.now(), paymentNotes);

            if (!order || !order.id) {
                throw new Error("Failed to create order");
            }

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Sarvtra Labs",
                description: `Purchase of ${itemDetails.name}`,
                image: "/favicon.svg", // Add your logo here
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                            user.id,
                            id,
                            type, // Pass 'course' or 'plan'
                            totalAmount
                        );

                        if (verifyRes.success) {
                            toast.success("Payment successful!");

                            // Redirect based on user role
                            if (user?.role) {
                                switch (user.role) {
                                    case 'student': router.push('/student/dashboard'); break;
                                    case 'school': router.push('/school/dashboard'); break;
                                    case 'teacher': router.push('/teacher/dashboard'); break;
                                    case 'govt': router.push('/govt/dashboard'); break;
                                    case 'superadmin': router.push('/admin/dashboard'); break;
                                    case 'helpsupport': router.push('/helpsupport/dashboard'); break;
                                    default: router.push('/student/dashboard');
                                }
                            } else {
                                router.push('/student/dashboard');
                            }
                        } else {
                            toast.error(verifyRes.message || "Payment verification failed.");
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error("Error verifying payment");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: '', // potentialUser.phone
                },
                notes: {
                    address: "Sarvtra Labs Corporate Office",
                    ...paymentNotes
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment failed");
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Failed to initiate payment");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading || isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!itemDetails) return null;

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 hover:bg-transparent hover:text-primary pl-0"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card rounded-2xl border shadow-sm p-6">
                            <h1 className="text-2xl font-bold mb-2">Checkout</h1>
                            <p className="text-muted-foreground mb-6">Review your order details below.</p>

                            <div className="flex gap-4 items-start p-4 bg-muted/50 rounded-xl mb-6">
                                <div className="w-24 h-24 bg-background rounded-lg border flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-10 h-10 text-primary/40" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{itemDetails.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">{type === 'plan' ? 'Subscription Plan' : 'Online Course'}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {itemDetails.features?.slice(0, 3).map((feature: string, i: number) => (
                                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{itemDetails.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (18% GST)</span>
                                    <span>₹{(itemDetails.price * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-4">
                                    <span>Total Amount</span>
                                    <span className="text-primary">₹{(itemDetails.price * 1.18).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="bg-card rounded-2xl border shadow-sm p-6">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-input shadow-sm transition-all checked:bg-primary checked:border-primary"
                                    />
                                    <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100" />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    I agree to the <span className="text-primary hover:underline">Terms and Conditions</span>, <span className="text-primary hover:underline">Privacy Policy</span>, and <span className="text-primary hover:underline">Refund Policy</span>.
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Payment Action */}
                    <div className="md:col-span-1">
                        <div className="bg-card rounded-2xl border shadow-sm p-6 sticky top-6">
                            <h3 className="font-semibold mb-4">Payment Details</h3>
                            <div className="space-y-4 mb-6">
                                <div className="p-3 border rounded-lg flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-primary bg-primary" />
                                    <span className="font-medium">Razorpay Secure</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                className="w-full h-12 text-base font-semibold"
                                disabled={isProcessing || !acceptedTerms}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${(itemDetails.price * 1.18).toLocaleString()}`
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Secure payment powered by Razorpay.
                                <br />
                                100% money-back guarantee for 7 days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
