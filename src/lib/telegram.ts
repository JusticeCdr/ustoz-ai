import {
  setOtpForSession,
  generateOtp,
  getSession,
  findSessionByPhoneOrCode,
  normalizePhone,
} from "./store";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "8671700223:AAFd10S_b6giHZszE9oezJas4yHQYwFeTac";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function tgApi(method: string, body?: any) {
  try {
    const res = await fetch(`${BASE_URL}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API error on ${method}:`, err);
    return { ok: false, error: err };
  }
}

export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML",
  replyMarkup?: any
) {
  return await tgApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: true,
    reply_markup: replyMarkup,
  });
}

/**
 * Handle incoming Telegram update (from Webhook or Polling)
 */
export async function handleTelegramUpdate(update: any) {
  const message = update?.message;
  if (!message) return null;

  const chatId = message.chat.id;
  const from = message.from;

  // 1. Handle Contact Shared (User pressed the contact share button)
  if (message.contact && message.contact.phone_number) {
    const rawPhone = message.contact.phone_number;
    console.log(`[Contact Received] Chat ${chatId} phone: ${rawPhone}`);

    const matchedSession = findSessionByPhoneOrCode(rawPhone);
    const otp = generateOtp();

    if (matchedSession) {
      setOtpForSession(matchedSession.sessionCode, otp, {
        id: from.id,
        username: from.username,
        firstName: from.first_name,
      });

      const otpMsg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Assalomu alaykum, <b>${matchedSession.fullName}</b>!
Telefon raqamingiz muvaffaqiyatli aniqlandi.

🎯 <b>Tanlangan yo'nalish:</b> ${matchedSession.trackTitle}
🆔 <b>Seans kodi:</b> <code>${matchedSession.sessionCode}</code>

━━━━━━━━━━━━━━━━━━━━━
🔐 <b>SIZNING TASDIQLASH PAROLINGIZ:</b>
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

💻 Ushbu 6 xonali parolni veb-saytdagi ro'yxatdan o'tish oynasiga kiriting va shaxsiy <b>Cyber Pass</b>ingizni oling!

⏱ <i>Kod amal qilish muddati: 10 daqiqa</i>`;

      await sendTelegramMessage(chatId, otpMsg, "HTML", {
        remove_keyboard: true,
      });
      return { handled: true, sessionCode: matchedSession.sessionCode, otp };
    } else {
      // Not yet registered on site with this phone
      const notFoundMsg = `⚠️ <b>Raqamingiz bo'yicha faol so'rov topilmadi!</b>

Sizning raqamingiz: <code>+${rawPhone.replace(/\D/g, "")}</code>
Iltimos, avval veb-saytda ushbu telefon raqam bilan anketani to'ldiring:
🌐 <b>Sayt:</b> <a href="http://localhost:3000">http://localhost:3000</a>

So'ngra parolni darhol ushbu botda olasiz!`;

      await sendTelegramMessage(chatId, notFoundMsg);
      return { handled: true, action: "contact_not_found" };
    }
  }

  const text: string = (message.text || "").trim();
  if (!text) return null;

  console.log(`[Telegram Message] Chat ${chatId} (@${from?.username || from?.first_name}): "${text}"`);

  // 2. Handle /start or /start verify_<session_id> or /start ref_<user_id>
  if (text.startsWith("/start")) {
    const parts = text.split(" ");
    let payload = parts[1]?.trim() || "";

    // Normalize verify_CODE or direct CODE
    if (payload.startsWith("verify_")) {
      payload = payload.replace("verify_", "");
    }

    if (payload.startsWith("ref_")) {
      const refId = payload.replace("ref_", "");
      const welcomeRefMsg = `🚀 <b>Assalomu alaykum, ${from.first_name}!</b>
Siz do'stingiz taklifi orqali <b>"Ustoz AI — Zamonaviy Kasblar Tanlovi"</b>ga tashrif buyurdingiz!

G'oliblik va qimmatbaho sovrinlar (MacBook, iPad, 100% grant) uchun bellashing!
🌐 Ro'yxatdan o'tish uchun veb-saytimizga tashrif buyuring:
👉 <a href="http://localhost:3000?ref=${refId}">http://localhost:3000</a>`;

      await sendTelegramMessage(chatId, welcomeRefMsg);
      return { handled: true, action: "referral_welcome" };
    }

    if (payload) {
      // Session Code provided in deep link
      const sessionCode = payload.toUpperCase();
      const existingSession = getSession(sessionCode);
      const otp = generateOtp();

      const session = setOtpForSession(sessionCode, otp, {
        id: from.id,
        username: from.username,
        firstName: from.first_name,
      });

      const participantName = session?.fullName || from.first_name || "Ishtirokchi";
      const trackName = session?.trackTitle || "Sun'iy Intellekt va Prompt Engineering";

      const welcomeMsg = `⚡ <b>USTOZ AI — ZAMONAVIY KASBLAR TANLOVI</b> ⚡

Assalomu alaykum, <b>${participantName}</b>!
Platformamizga muvaffaqiyatli ulandingiz.

🎯 <b>Tanlangan yo'nalish:</b> ${trackName}
🆔 <b>Seans kodi:</b> <code>${sessionCode}</code>

━━━━━━━━━━━━━━━━━━━━━
🔐 <b>SIZNING TASDIQLASH PAROLINGIZ:</b>
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

💻 Ushbu 6 xonali parolni veb-saytdagi ro'yxatdan o'tish oynasiga kiriting va shaxsiy <b>Cyber Pass</b>ingizni oling!

⏱ <i>Kod amal qilish muddati: 10 daqiqa</i>
🚀 <i>Ustoz AI jamoasi sizga g'alaba tilaydi!</i>`;

      await sendTelegramMessage(chatId, welcomeMsg, "HTML", {
        remove_keyboard: true,
      });
      return { handled: true, sessionCode, otp };
    } else {
      // General /start without payload
      // Provide Contact share button and instruction
      const keyboard = {
        keyboard: [
          [
            {
              text: "📱 Telefon raqamni yuborish (Kodni olish)",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      };

      const startMsg = `🤖 <b>Ustoz AI — Zamonaviy Kasblar Tanlovi Boti</b>

Assalomu alaykum, <b>${from.first_name}</b>!
Tanlovda ro'yxatdan o'tish tasdiqlash botiga xush kelibsiz.

🔹 <b>1-usul:</b> Pastdagi <b>«📱 Telefon raqamni yuborish»</b> tugmasini bosing.
🔹 <b>2-usul:</b> Saytda ko'rsatilgan seans kodini yoki telefon raqamingizni to'g'ridan-to'g'ri shu yerga yozing.

🌐 <i>Veb-sayt: <a href="http://localhost:3000">http://localhost:3000</a></i>`;

      await sendTelegramMessage(chatId, startMsg, "HTML", keyboard);
      return { handled: true, action: "general_start" };
    }
  }

  // 3. User typed a phone number or session code directly in chat
  const matched = findSessionByPhoneOrCode(text);
  if (matched) {
    const otp = generateOtp();
    setOtpForSession(matched.sessionCode, otp, {
      id: from.id,
      username: from.username,
      firstName: from.first_name,
    });

    const replyMsg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Topildi! <b>${matched.fullName}</b>
🎯 <b>Yo'nalish:</b> ${matched.trackTitle}
🆔 <b>Seans kodi:</b> <code>${matched.sessionCode}</code>

━━━━━━━━━━━━━━━━━━━━━
🔐 <b>SIZNING TASDIQLASH PAROLINGIZ:</b>
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

💻 Ushbu 6 xonali parolni saytdagi oynaga kiriting!`;

    await sendTelegramMessage(chatId, replyMsg, "HTML", {
      remove_keyboard: true,
    });
    return { handled: true, sessionCode: matched.sessionCode, otp };
  }

  // Fallback help
  if (text === "/help" || text.toLowerCase() === "yordam") {
    await sendTelegramMessage(
      chatId,
      `ℹ️ <b>Yordam:</b>\nRo'yxatdan o'tish uchun saytdagi havolani bosing yoki saytda kiritgan telefon raqamingizni shu yerga yozing.`
    );
    return { handled: true };
  }

  return { handled: false };
}
