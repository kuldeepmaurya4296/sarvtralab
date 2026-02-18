import SignupPage from './SignupPage';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
    title: 'Sign Up',
    description: 'Create your Sarvtra Labs account and start your journey into robotics and coding.',
});

export default function Page() {
    return <SignupPage />;
}
