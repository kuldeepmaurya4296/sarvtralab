import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CoursesSection from '@/components/home/CoursesSection';
import VideosSection from '@/components/home/VideosSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import PublicLayout from '@/components/layout/PublicLayout';

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CoursesSection />
      <VideosSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </PublicLayout>
  );
}
