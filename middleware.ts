import {NextRequest, NextResponse} from "next/server";
import {runWithAmplifyServerContext} from "@/utils/amplify-utils";
import {fetchAuthSession} from "@aws-amplify/core/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    if (request.nextUrl.pathname === "/") {
        return NextResponse.next();
    }

    const authenticated = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return (
                    session.tokens?.accessToken !== undefined &&
                    session.tokens?.idToken !== undefined
                );
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    });

    if (authenticated && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!authenticated && request.nextUrl.pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};