"use server";

export async function sendTelegramMessage(message) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_API_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message,
  };

  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error sending message to Telegram:", error.message);
  }
}
