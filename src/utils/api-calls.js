"use server";
import { getCookie } from "./cookie";

const apiUrl = process.env.API_URL;

async function getAuthToken() {
  return await getCookie(process.env.NEXT_PUBLIC_SESSION_COOKIE);
}

export async function postData(url, data) {
  const token = await getAuthToken();

  const res = await fetch(apiUrl + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    return {
      error: true,
      response: resData,
    };
  }

  return {
    error: false,
    response: resData,
  };
}

export async function getData(url, revalidate = 600) {
  const token = await getAuthToken();

  const res = await fetch(apiUrl + url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": `Bearer ${token}`,
    },
    next: { revalidate },
  });

  const resData = await res.json();

  if (!res.ok) {
    return {
      error: true,
      response: resData,
    };
  }

  return {
    error: false,
    response: resData,
  };
}

export async function putData(url, data) {
  const token = await getAuthToken();

  const res = await fetch(apiUrl + url, {
    method: "PUT",
    headers: {
      "auth-token": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    return {
      error: true,
      response: resData,
    };
  }

  return {
    error: false,
    response: resData,
  };
}

export async function deleteData(url, data) {
  const token = await getAuthToken();

  const res = await fetch(apiUrl + url, {
    method: "DELETE",
    headers: {
      "auth-token": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    return {
      error: true,
      response: resData,
    };
  }

  return {
    error: false,
    response: resData,
  };
}
