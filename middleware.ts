
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Define protected routes
    const protectedRoutes = {
        '/student': 'student',
        '/school': 'school',
        '/admin': 'superadmin',
        '/govt': 'govt',
        '/teacher': 'teacher',
        '/helpsupport': 'helpsupport'
    };

    // Check if path is protected
    const matchingRoute = Object.keys(protectedRoutes).find(route => pathname.startsWith(route));

    if (matchingRoute) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }

        const requiredRole = protectedRoutes[matchingRoute as keyof typeof protectedRoutes];
        const userRole = token.role as string;

        // Special handling: teachers can also access school routes
        if (matchingRoute === '/school' && (userRole === 'teacher' || userRole === 'school')) {
            return NextResponse.next();
        }

        // Special handling: helpsupport can also access admin routes
        if (matchingRoute === '/admin' && userRole === 'helpsupport') {
            return NextResponse.next();
        }

        // General role check
        if (userRole !== requiredRole) {
            // Check if superadmin, maybe allow access to everything? 
            if (userRole === 'superadmin') return NextResponse.next();

            // Redirect to unauthorized or their own dashboard
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Redirect logged-in users away from login/signup
    if (token && (pathname === '/login' || pathname === '/signup')) {
        const role = token.role as string;
        if (role === 'student') return NextResponse.redirect(new URL('/student/dashboard', request.url));
        if (role === 'school') return NextResponse.redirect(new URL('/school/dashboard', request.url));
        if (role === 'teacher') return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
        if (role === 'admin' || role === 'superadmin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        if (role === 'govt') return NextResponse.redirect(new URL('/govt/dashboard', request.url));
        if (role === 'helpsupport') return NextResponse.redirect(new URL('/helpsupport/dashboard', request.url));
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/student/:path*', '/school/:path*', '/admin/:path*', '/govt/:path*', '/teacher/:path*', '/helpsupport/:path*', '/login', '/signup']
};
