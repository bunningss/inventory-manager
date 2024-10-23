import { NextResponse } from "next/server";
import { getSession } from "./utils/auth";

export async function middleware(request) {
  const session = await getSession();

  if (
    session.payload?.role?.toLowerCase() !== "admin" &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (!session.error && request.nextUrl.pathname === "/sign-in") ||
    (!session.error && request.nextUrl.pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session.error && request.nextUrl.pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    !session.error &&
    request.nextUrl.pathname.startsWith("/forgot-password")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !session.error &&
    request.nextUrl.pathname.startsWith("/reset-password")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
