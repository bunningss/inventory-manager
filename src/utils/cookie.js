"use server";
import { cookies } from "next/headers";
import { getEnv } from "./get-env";

export async function setCookie(name, value) {
  cookies().set(name, value, {
    maxAge: Number(getEnv("TOKEN_EXPIRY_TIME")),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCookie(name) {
  return cookies().get(name)?.value;
}
