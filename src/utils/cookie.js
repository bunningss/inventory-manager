"use server";
import { cookies } from "next/headers";

export async function setCookie(name, value) {
  cookies().set(name, value, {
    maxAge: process.env.TOKEN_EXPIRY_TIME,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCookie(name) {
  return cookies().get(name)?.value;
}
