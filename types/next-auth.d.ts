
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            accessToken?: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role: string;
        id: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: string;
        id: string;
    }
}
