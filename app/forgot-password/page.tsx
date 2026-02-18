import ForgotPasswordPage from './ForgotPasswordPage';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
    title: 'Forgot Password',
    description: 'Reset your Sarvtra Labs account password.',
});

export default function Page() {
    return <ForgotPasswordPage />;
}
