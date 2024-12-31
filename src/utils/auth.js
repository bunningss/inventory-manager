"use server";
import { jwtVerify } from "jose";
import { getCookie, setCookie } from "./cookie";
import { getData } from "./api-calls";
import { permissions } from "@/lib/static";

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

export async function verifyToken(request, action) {
  try {
    if (!action) throw new Error("You are not authorized.");

    const token = await request.headers.get("auth-token");
    const sessionKey = token?.split(" ")[1];

    if (!sessionKey) throw new Error("You are not authorized.");

    const verifiedToken = await jwtVerify(
      sessionKey,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        algorithms: ["HS256"],
      }
    );

    await checkPermission(action, verifiedToken.payload?._id);

    return {
      error: false,
      payload: verifiedToken.payload,
      id: verifiedToken.payload?._id,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function logout() {
  await setCookie(process.env.NEXT_PUBLIC_SESSION_COOKIE, "", 0);
}

export const checkPermission = async (action, id) => {
  const { response } = await getData(`get-role/${id}`, 0);
  const rolePermissions = permissions[response.payload?.role];

  if (!rolePermissions) {
    throw new Error("You are not authorized.");
  }

  if (rolePermissions.can?.includes("manage:all")) {
    return true;
  }

  if (!rolePermissions.can?.includes(action)) {
    throw new Error("You are not authorized.");
  }

  return true;
};
