"use server";
import { cookies } from "next/headers";

export async function setCookie(name, value, expires) {
  cookies().set(name, value, {
    maxAge: expires,
    httpOnly: true,
  });
}

export async function getCookie(name) {
  return cookies().get(name)?.value;
}
