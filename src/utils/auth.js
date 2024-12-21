"use server";
import { jwtVerify } from "jose";
import { getCookie, setCookie } from "./cookie";

export async function getSession() {
  const session = await getCookie(process.env.NEXT_PUBLIC_SESSION_COOKIE);

  if (!session)
    return {
      error: true,
      payload: null,
    };

  try {
    const verifiedToken = await jwtVerify(
      session,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        algorithms: ["HS256"],
      }
    );

    return {
      error: false,
      payload: verifiedToken.payload,
    };
  } catch (err) {
    return {
      error: true,
      payload: null,
    };
  }
}

export async function verifyToken(request) {
  try {
    const token = await request.headers.get("auth-token");
    const sessionKey = token?.split(" ")[1];

    if (!sessionKey)
      return {
        error: true,
        payload: null,
      };
    const verifiedToken = await jwtVerify(
      sessionKey,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        algorithms: ["HS256"],
      }
    );

    return {
      error: false,
      payload: verifiedToken.payload,
    };
  } catch (err) {
    return {
      error: true,
      payload: null,
    };
  }
}

export async function logout() {
  await Promise.all([setCookie(process.env.NEXT_PUBLIC_SESSION_COOKIE, "", 0)]);
}
