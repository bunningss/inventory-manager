import { NextResponse } from "next/server";
import { checkPermission, getSession } from "./utils/auth";

const HOME_URL = "/";
const SIGN_IN_URL = "/sign-in";

export async function middleware(request) {
  const { error, payload } = await getSession();
  const { pathname } = request.nextUrl;
  const isAllowed = await checkPermission("view:dashboard", payload._id);

  // Redirect authenticated users from auth pages
  if (!error) {
    if (
      pathname === SIGN_IN_URL ||
      pathname === "/sign-up" ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password")
    ) {
      return NextResponse.redirect(new URL(HOME_URL, request.url));
    }
  }

  // Redirect non-admin users from dashboard
  if (!isAllowed && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL(HOME_URL, request.url));
  }

  // Redirect unauthenticated users from user pages
  if (error && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ],
};
