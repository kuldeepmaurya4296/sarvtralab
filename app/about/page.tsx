import PublicLayout from '@/components/layout/PublicLayout';
import AboutContent from '@/components/about/AboutContent';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
    title: 'About Us | Sarvtra Labs',
    description: 'Discover Sarvtra Labs (Sarwatra Labs), India\'s leading robotics education platform. We are committed to empowering students with next-gen STEM skills through hands-on learning.',
    keywords: ['About Sarvtra Labs', 'Robotics Education India', 'STEM Platform', 'Edutech Bhopal', 'Sarwatra Labs'],
});

export default function AboutPage() {
    return (
        <PublicLayout>
            <AboutContent />
        </PublicLayout>
    );
}
