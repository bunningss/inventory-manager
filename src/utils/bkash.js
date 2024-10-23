"use server";

export async function createGrantToken() {
  try {
    const res = await fetch(process.env.BKASH_GRANT_TOKEN_URL, {
      method: "POST",
      body: JSON.stringify({
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_SECRET_KEY,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: "sandboxTokenizedUser02",
        password: "sandboxTokenizedUser02@12345",
      },
    });

    const resData = await res.json();

    if (!resData.id_token) {
      return {
        error: true,
        payload: null,
      };
    }

    return {
      error: false,
      payload: resData.id_token,
    };
  } catch (err) {
    return {
      error: true,
      payload: null,
    };
  }
}

export async function createPayment(paymentData, id_token) {
  try {
    const res = await fetch(process.env.BKASH_PAYMENT_CREATE_URL, {
      method: "POST",
      body: JSON.stringify({
        mode: "0011",
        payerReference: " ",
        callbackURL: process.env.NEXT_PUBLIC_API_URL + "bkashpay",
        amount: 70,
        intent: "sale",
        merchantInvoiceNumber: "inv" + Date.now(),
        currency: "BDT",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-app-key": process.env.BKASH_APP_KEY,
        Authorization: id_token,
      },
    });

    const resData = await res.json();

    if (!resData.bkashURL) {
      return {
        error: true,
        payload: null,
      };
    }

    return {
      error: false,
      payload: resData.bkashURL,
    };
  } catch (err) {
    return {
      error: true,
      payload: null,
    };
  }
}
