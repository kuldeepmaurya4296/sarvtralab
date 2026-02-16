'use client';
import PublicLayout from '@/components/layout/PublicLayout';

export default function TermsPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-32">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                    <p>Welcome to Sarvtra Lab. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Use of License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Sarvtra Lab&apos;s website for personal, non-commercial transitory viewing only.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Disclaimer</h2>
                    <p>The materials on Sarvtra Lab&apos;s website are provided on an &apos;as is&apos; basis. Sarvtra Lab makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Limitations</h2>
                    <p>In no event shall Sarvtra Lab or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sarvtra Lab&apos;s website.</p>
                </div>
            </div>
        </PublicLayout>
    );
}
