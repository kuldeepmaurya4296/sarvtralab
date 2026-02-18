import ResetPasswordPage from './ResetPasswordPage';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
    title: 'Reset Password',
    description: 'Create a new password for your Sarvtra Labs account.',
});

export default function Page() {
    return <ResetPasswordPage />;
}
