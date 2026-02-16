'use client';
import PublicLayout from '@/components/layout/PublicLayout';

export default function PrivacyPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-32">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                    <p>Your privacy is important to us. It is Sarvtra Lab&apos;s policy to respect your privacy regarding any information we may collect from you across our website.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Usage of Information</h2>
                    <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we&apos;ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Sharing of Information</h2>
                    <p>We don&apos;t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Cookies</h2>
                    <p>We use cookies to maintain your session and preferences. You provide consent to use cookies when you effectively use our website.</p>
                </div>
            </div>
        </PublicLayout>
    );
}
