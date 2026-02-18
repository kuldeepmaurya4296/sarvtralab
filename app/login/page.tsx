import LoginPage from './LoginPage';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
    title: 'Login',
    description: 'Sign in to your Sarvtra Labs account to continue your learning journey.',
});

export default function Page() {
    return <LoginPage />;
}
