"use server";
import { cookies } from "next/headers";

export async function setCookie(name, value, expiresIn) {
  cookies().set(name, value, {
    maxAge: expiresIn,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCookie(name) {
  return cookies().get(name)?.value;
}
