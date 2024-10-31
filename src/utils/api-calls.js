"use server";

import axios from "axios";
import { getCookie } from "./cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getAuthToken() {
  return await getCookie("ze-session");
}

export async function postData(url, data) {
  const token = await getAuthToken();

  try {
    const res = await axios.post(apiUrl + url, data, {
      headers: {
        "auth-token": `Bearer ${token}`,
      },
    });

    return {
      error: false,
      response: res.data,
    };
  } catch (error) {
    return {
      error: true,
      response: error.response?.data || error.message,
    };
  }
}

export async function getData(url, revalidate = 600) {
  const token = await getAuthToken();

  try {
    const res = await axios.get(apiUrl + url, {
      headers: {
        "auth-token": `Bearer ${token}`,
      },
      params: { revalidate },
    });

    return {
      error: false,
      response: res.data,
    };
  } catch (error) {
    return {
      error: true,
      response: error.response?.data || error.message,
    };
  }
}

export async function putData(url, data) {
  const token = await getAuthToken();

  try {
    const res = await axios.put(apiUrl + url, data, {
      headers: {
        "auth-token": `Bearer ${token}`,
      },
    });

    return {
      error: false,
      response: res.data,
    };
  } catch (error) {
    return {
      error: true,
      response: error.response?.data || error.message,
    };
  }
}

export async function deleteData(url, data) {
  const token = await getAuthToken();

  try {
    const res = await axios.delete(apiUrl + url, {
      headers: {
        "auth-token": `Bearer ${token}`,
      },
      data, // axios allows the data to be passed here
    });

    return {
      error: false,
      response: res.data,
    };
  } catch (error) {
    return {
      error: true,
      response: error.response?.data || error.message,
    };
  }
}
