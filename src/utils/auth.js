"use server";
import { jwtVerify, SignJWT } from "jose";
import { getCookie, setCookie } from "./cookie";
import { getData } from "./api-calls";
import { permissions } from "@/lib/static";
import { getEnv } from "./get-env";

export async function getSession() {
  const session = await getCookie(getEnv("NEXT_PUBLIC_SESSION_COOKIE"));

  if (!session)
    return {
      error: true,
      payload: null,
    };

  try {
    const verifiedToken = await jwtVerify(
      session,
      new TextEncoder().encode(getEnv("TOKEN_SECRET")),
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

export async function verifyToken(request, action) {
  try {
    if (!action) throw new Error("You are not authorized.");

    const token = await request.headers.get("auth-token");
    const sessionKey = token?.split(" ")[1];

    if (!sessionKey) throw new Error("You are not authorized.");

    const verifiedToken = await jwtVerify(
      sessionKey,
      new TextEncoder().encode(getEnv("TOKEN_SECRET")),
      {
        algorithms: ["HS256"],
      }
    );

    await checkPermission(action, verifiedToken.payload?._id);

    return {
      error: false,
      payload: verifiedToken.payload,
      id: verifiedToken.payload?._id,
      role: verifiedToken.payload?.role,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function logout() {
  await setCookie(getEnv("NEXT_PUBLIC_SESSION_COOKIE"), "", 0);
}

export const checkPermission = async (action, id) => {
  const { response } = await getData(`get-role/${id}`, 0);

  if (!(await hasPermission(action, response.payload?.role)))
    throw new Error("You are not authorized.");
};

export async function hasPermission(action, role) {
  const rolePermissions = permissions[role];

  if (!rolePermissions) {
    return false;
  }

  if (rolePermissions.can?.includes("manage:all")) {
    return true;
  }

  if (!rolePermissions.can?.includes(action)) {
    return false;
  }

  return true;
}

export async function signToken(data) {
  if (!data) throw new Error("Login process failed.");

  const expiry = getEnv("TOKEN_EXPIRY_TIME");
  const secretKey = new TextEncoder().encode(getEnv("TOKEN_SECRET"));

  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiry}s`)
    .sign(secretKey);
}
