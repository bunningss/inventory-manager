import axios from "axios";

export async function sendTelegramMessage(message) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_API_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message,
  };

  try {
    const response = await axios.post(url, payload);

    if (response.data.ok) {
      console.log("Message sent successfully:", response.data.result);
    } else {
      console.error("Error sending message:", response.data.description);
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error.message);
  }
}
