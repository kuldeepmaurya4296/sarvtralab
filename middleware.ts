
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Define role-based access rules
        const roles = {
            superadmin: ['/admin', '/superadmin', '/api/admin'],
            admin: ['/admin', '/api/admin'],
            govt: ['/govt', '/api/govt'],
            school: ['/school', '/api/school'],
            teacher: ['/teacher', '/api/teacher'],
            student: ['/student', '/api/student'],
            helpsupport: ['/helpsupport', '/api/helpsupport'],
        };

        // Check if user has permission for the current path
        const userRole = token?.role as string;

        if (path.startsWith('/admin') || path.startsWith('/superadmin')) {
            if (userRole !== 'superadmin' && userRole !== 'admin') {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        } else if (path.startsWith('/govt') && userRole !== 'govt') {
            return NextResponse.redirect(new URL('/login', req.url));
        } else if (path.startsWith('/school') && userRole !== 'school') {
            return NextResponse.redirect(new URL('/login', req.url));
        } else if (path.startsWith('/teacher') && userRole !== 'teacher') {
            return NextResponse.redirect(new URL('/login', req.url));
        } else if (path.startsWith('/student') && userRole !== 'student') {
            return NextResponse.redirect(new URL('/login', req.url));
        } else if (path.startsWith('/helpsupport') && userRole !== 'helpsupport') {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/superadmin/:path*",
        "/school/:path*",
        "/teacher/:path*",
        "/student/:path*",
        "/govt/:path*",
        "/helpsupport/:path*",
    ],
};
