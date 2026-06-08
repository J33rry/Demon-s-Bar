import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const isAuthenticated = request.cookies.get("auth_token");

    if (!isAuthenticated && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isAuthenticated && ["/login", "/"].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/dashboard/:path*", "/login/:path*", "/"],
};
