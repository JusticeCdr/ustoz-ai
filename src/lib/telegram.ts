import {
  setOtpForSession,
  generateOtp,
  getSession,
  findSessionByPhoneOrCode,
  normalizePhone,
  saveTelegramUser,
  createSession,
} from "./store";
import { analyzeUserAudio, analyzeUserText } from "./ai-advisor";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "8671700223:AAFd10S_b6giHZszE9oezJas4yHQYwFeTac";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
 * Download raw binary file from Telegram API (for Voice Notes / Audio)
 */
export async function downloadTelegramFileBuffer(filePath: string): Promise<Buffer | null> {
  try {
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Download telegram file failed. HTTP ${res.status}`);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("Failed to download telegram file:", err);
    return null;
  }
}

/**
 * Handle incoming Telegram update (from Webhook or Polling)
 */
export async function handleTelegramUpdate(update: any) {
  const message = update?.message;
  if (!message) return null;

  const chatId = message.chat.id;
  const from = message.from;

  // 1. Handle Voice / Audio Message (AI Voice to Career Recommendation)
  if (message.voice || message.audio) {
    const fileId = message.voice?.file_id || message.audio?.file_id;
    const mimeType = message.voice?.mime_type || message.audio?.mime_type || "audio/ogg";
    console.log(`[Voice Received] Chat ${chatId} from ${from?.first_name} (fileId: ${fileId})`);

    // Show typing status in chat
    await tgApi("sendChatAction", { chat_id: chatId, action: "typing" });

    // Send instant acknowledgement
    await sendTelegramMessage(
      chatId,
      `🎙 <b>Ovozingiz qabul qilindi!</b>\n🧠 <i>Ustoz AI neyron yadrosi ovozingizni tinglamoqda va qiziqishingizni tahlil qilmoqda... Bir necha soniya kuting...</i>`
    );

    try {
      const fileInfo = await tgApi("getFile", { file_id: fileId });
      if (!fileInfo.ok || !fileInfo.result?.file_path) {
        throw new Error("Telegramdan audio fayl havolasini olib bo'lmadi");
      }

      const audioBuffer = await downloadTelegramFileBuffer(fileInfo.result.file_path);
      if (!audioBuffer) {
        throw new Error("Audio faylni yuklab olishda xatolik yuz berdi");
      }

      // Run AI audio analysis (Gemini direct audio / Whisper / NLP)
      const rec = await analyzeUserAudio(audioBuffer, mimeType);
      const registerUrl = `${APP_URL}?track=${rec.trackId}&source=voice_bot`;

      const responseText = `🧠 <b>USTOZ AI — OVOZLI KARYERA DIAGNOSTIKASI</b> 🧠

🎙 <b>Eshitilgan xabar:</b>
<i>"${rec.transcription || "Ovozli qiziqishingiz muvaffaqiyatli tahlil qilindi"}"</i>

━━━━━━━━━━━━━━━━━━━━━
🎯 <b>SIZGA ENG MOS ZAMONAVIY YO'NALISH:</b>
✨ <b>${rec.trackTitle}</b> ✨
📊 <b>Moslik darajasi:</b> <code>${rec.matchScore}%</code>
━━━━━━━━━━━━━━━━━━━━━

💡 <b>Nima uchun aynan shu kasb?</b>
${rec.reason}

💼 <b>Kutilayotgan daromad:</b> <b>${rec.salaryRange}</b>
🔑 <b>Asosiy ko'nikmalar:</b>
${rec.keySkills.map((s) => `• ${s}`).join("\n")}

🏆 Ushbu yo'nalish bo'yicha <b>"Zamonaviy Kasblar Tanlovi"</b>da qatnashing va <b>MacBook Pro</b> yutib oling!`;

      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: `🚀 Ushbu yo'nalishda ro'yxatdan o'tish`,
              url: registerUrl,
            },
          ],
          [
            {
              text: `🌐 Veb-platformani ochish`,
              url: APP_URL,
            },
          ],
        ],
      };

      await sendTelegramMessage(chatId, responseText, "HTML", inlineKeyboard);
      return { handled: true, action: "voice_analysis", result: rec };
    } catch (err: any) {
      console.error("Voice handling error:", err);
      await sendTelegramMessage(
        chatId,
        `⚠️ <b>Ovozni tahlil qilishda nosozlik:</b>\n<i>${err.message || "Xatolik"}</i>\n\n💡 O'z qiziqishingiz haqida shu yerga matn ko'rinishida yozing (masalan: <i>"Men 3D dizayn va animatsiyaga qiziqaman"</i>) va AI darhol sizga mos kursni tavsiya qiladi!`
      );
      return { handled: true, action: "voice_error" };
    }
  }

  // 2. Handle Contact Shared (User pressed the contact share button)
  if (message.contact && message.contact.phone_number) {
    const rawPhone = message.contact.phone_number;
    console.log(`[Contact Received] Chat ${chatId} phone: ${rawPhone}`);

    saveTelegramUser(rawPhone, {
      id: from.id,
      username: from.username,
      firstName: from.first_name,
    });

    let matchedSession = findSessionByPhoneOrCode(rawPhone);
    const otp = generateOtp();
    const ONE_MINUTE_MS = 60 * 1000;

    if (!matchedSession) {
      matchedSession = createSession({
        fullName: from.first_name || "Foydalanuvchi",
        phone: rawPhone,
        trackId: "ai-prompt",
        trackTitle: "Sun'iy Intellekt va Prompt Engineering",
      });
    }

    setOtpForSession(
      matchedSession.sessionCode,
      otp,
      {
        id: from.id,
        username: from.username,
        firstName: from.first_name,
      },
      ONE_MINUTE_MS
    );

    const otpMsg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Assalomu alaykum, <b>${matchedSession.fullName}</b>!
Telefon raqamingiz muvaffaqiyatli aniqlandi.

━━━━━━━━━━━━━━━━━━━━━
🔐 <b>SIZNING BIR MARTALIK PAROLINGIZ:</b>
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

⏱ <b>Kod amal qilish muddati: 1 daqiqa (60 soniya).</b>
💻 Ushbu kodni veb-saytdagi oynaga kiriting!`;

    await sendTelegramMessage(chatId, otpMsg, "HTML", {
      remove_keyboard: true,
    });
    return { handled: true, sessionCode: matchedSession.sessionCode, otp };
  }

  const text: string = (message.text || "").trim();
  if (!text) return null;

  console.log(`[Telegram Message] Chat ${chatId} (@${from?.username || from?.first_name}): "${text}"`);

  // 3. User requested AI Voice / Career Advisor intro
  if (
    text.includes("Ovozli AI Konsultant") ||
    text.includes("Kurs tanlash") ||
    text === "/ai" ||
    text === "/voice"
  ) {
    const aiIntro = `🎙 <b>Ustoz AI — Ovozli Karyera Maslahatchisi</b> 🧠

Pastdagi <b>mikrofon</b> tugmasini bosib ushlab turing va o'z qiziqishingiz, orzuingiz yoki ko'nikmalaringiz haqida <b>ovozli xabar</b> yuboring!

<i>Masalan aytishingiz mumkin:</i>
🗣 <i>"Salom, men rasm chizish, kompyuter grafikasi va 3D modellashtirishga juda qiziqaman. Qaysi kurs menga to'g'ri keladi?"</i>
🗣 <i>"Men dasturlashni noldan boshlamoqchiman, saytlar va veb-ilovalar yaratmoqchiman."</i>
🗣 <i>"Men axborot xavfsizligi va tizimlarni kiberhujumlardan himoya qilishni xohlayman."</i>

✨ <b>Sun'iy intellekt ovozingizni tinglab, sizga 100% mos zamonaviy kasbni darhol tanlab beradi!</b>`;

    await sendTelegramMessage(chatId, aiIntro, "HTML");
    return { handled: true, action: "ai_voice_prompt" };
  }

  // 4. Handle /start commands
  if (text.startsWith("/start")) {
    const parts = text.split(" ");
    let payload = parts[1]?.trim() || "";

    // Normalize payload
    if (payload.startsWith("ref_")) {
      const refId = payload.replace("ref_", "");
      const welcomeRefMsg = `🚀 <b>Assalomu alaykum, ${from.first_name}!</b>
Siz do'stingiz taklifi orqali <b>"Ustoz AI — Zamonaviy Kasblar Tanlovi"</b>ga tashrif buyurdingiz!

G'oliblik va qimmatbaho sovrinlar (MacBook, iPad, 100% grant) uchun bellashing!
🌐 Ro'yxatdan o'tish uchun veb-saytimizga tashrif buyuring:
👉 <a href="${APP_URL}?ref=${refId}">${APP_URL}</a>`;

      await sendTelegramMessage(chatId, welcomeRefMsg);
      return { handled: true, action: "referral_welcome" };
    }

    // Auth by phone: /start auth_998901234567 or /start phone_998901234567
    if (payload.startsWith("auth_") || payload.startsWith("phone_")) {
      const rawPhone = payload.replace(/^(auth_|phone_)/, "");
      saveTelegramUser(rawPhone, {
        id: from.id,
        username: from.username,
        firstName: from.first_name,
      });

      let matchedSession = findSessionByPhoneOrCode(rawPhone);
      const otp = generateOtp();
      const ONE_MINUTE_MS = 60 * 1000;

      if (!matchedSession) {
        matchedSession = createSession({
          fullName: from.first_name || "Foydalanuvchi",
          phone: rawPhone,
          trackId: "ai-prompt",
          trackTitle: "Sun'iy Intellekt va Prompt Engineering",
        });
      }

      setOtpForSession(
        matchedSession.sessionCode,
        otp,
        {
          id: from.id,
          username: from.username,
          firstName: from.first_name,
        },
        ONE_MINUTE_MS
      );

      const otpMsg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Assalomu alaykum, <b>${matchedSession.fullName || from.first_name}</b>!
Sizning bir martalik tasdiqlash parolingiz:

━━━━━━━━━━━━━━━━━━━━━
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

⏱ <b>Amal qilish muddati: 1 daqiqa (60 soniya).</b>
💻 Ushbu kodni veb-saytga kiriting!`;

      await sendTelegramMessage(chatId, otpMsg, "HTML", {
        remove_keyboard: true,
      });
      return { handled: true, sessionCode: matchedSession.sessionCode, otp };
    }

    // Direct session code deep link: /start verify_CODE or /start CODE
    if (payload) {
      const sessionCode = payload.replace("verify_", "").toUpperCase();
      const existingSession = getSession(sessionCode);
      const otp = generateOtp();
      const ONE_MINUTE_MS = 60 * 1000;

      const session = setOtpForSession(
        sessionCode,
        otp,
        {
          id: from.id,
          username: from.username,
          firstName: from.first_name,
        },
        ONE_MINUTE_MS
      );

      const participantName = session?.fullName || from.first_name || "Ishtirokchi";

      const welcomeMsg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Assalomu alaykum, <b>${participantName}</b>!
Sizning bir martalik tasdiqlash parolingiz:

━━━━━━━━━━━━━━━━━━━━━
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

⏱ <b>Amal qilish muddati: 1 daqiqa (60 soniya).</b>
💻 Ushbu 6 xonali parolni saytdagi oynaga kiriting!`;

      await sendTelegramMessage(chatId, welcomeMsg, "HTML", {
        remove_keyboard: true,
      });
      return { handled: true, sessionCode, otp };
    }

    // Plain /start without parameters
    const keyboard = {
      keyboard: [
        [
          {
            text: "📱 Telefon raqamni yuborish (Kodni olish)",
            request_contact: true,
          },
        ],
        [
          {
            text: "🎙 Ovozli AI Konsultant (Kurs tanlash)",
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    };

    const startMsg = `🤖 <b>Ustoz AI — Zamonaviy Kasblar Tanlovi Boti</b>

Assalomu alaykum, <b>${from.first_name}</b>!
Platformamizning rasmiy sun'iy intellekt botiga xush kelibsiz.

🔹 <b>Kodni olish:</b> Pastdagi <b>«📱 Telefon raqamni yuborish»</b> tugmasini bosing yoki telefon raqamingizni yozing.
🎙 <b>Ovozli AI Konsultant:</b> Menga to'g'ridan-to'g'ri <b>ovozli xabar (golos)</b> yuboring! AI ovozingizni tinglab, sizga qaysi zamonaviy kasb 100% mos kelishini tanlab beradi!

🌐 <i>Veb-sayt: <a href="${APP_URL}">${APP_URL}</a></i>`;

    await sendTelegramMessage(chatId, startMsg, "HTML", keyboard);
    return { handled: true, action: "general_start" };
  }

  // 5. Handle AI Career Query via Text (e.g. user describes what they want)
  const cleanDigits = text.replace(/\D/g, "");
  const lower = text.toLowerCase();
  const isCareerQuery =
    text.startsWith("/ai ") ||
    lower.includes("kurs") ||
    lower.includes("kasb") ||
    lower.includes("qiziqaman") ||
    lower.includes("maslahat") ||
    lower.includes("tavsiya") ||
    lower.includes("dizayn") ||
    lower.includes("dasturlash") ||
    lower.includes("kiber") ||
    lower.includes("data science") ||
    lower.includes("prompt");

  if (isCareerQuery && text.length >= 7 && cleanDigits.length < 9) {
    await tgApi("sendChatAction", { chat_id: chatId, action: "typing" });
    const cleanPrompt = text.replace(/^\/ai\s*/i, "");
    const rec = await analyzeUserText(cleanPrompt);
    const registerUrl = `${APP_URL}?track=${rec.trackId}&source=text_bot`;

    const responseText = `🧠 <b>USTOZ AI — KARYERA DIAGNOSTIKASI</b> 🧠

📝 <b>Sizning savolingiz / qiziqishingiz:</b>
<i>"${text.slice(0, 160)}${text.length > 160 ? "..." : ""}"</i>

━━━━━━━━━━━━━━━━━━━━━
🎯 <b>SIZGA ENG MOS ZAMONAVIY YO'NALISH:</b>
✨ <b>${rec.trackTitle}</b> ✨
📊 <b>Moslik darajasi:</b> <code>${rec.matchScore}%</code>
━━━━━━━━━━━━━━━━━━━━━

💡 <b>AI Xulosasi:</b>
${rec.reason}

💼 <b>Kutilayotgan daromad:</b> <b>${rec.salaryRange}</b>
🔑 <b>Asosiy ko'nikmalar:</b>
${rec.keySkills.map((s) => `• ${s}`).join("\n")}

🏆 Ushbu yo'nalish bo'yicha <b>"Zamonaviy Kasblar Tanlovi"</b>da qatnashing va <b>MacBook Pro</b> yutib oling!`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: `🚀 Ushbu yo'nalishda ro'yxatdan o'tish`,
            url: registerUrl,
          },
        ],
        [
          {
            text: "🌐 Veb-platformaga o'tish",
            url: APP_URL,
          },
        ],
      ],
    };

    await sendTelegramMessage(chatId, responseText, "HTML", inlineKeyboard);
    return { handled: true, action: "text_ai_analysis", result: rec };
  }

  // 6. User typed a phone number directly in chat (e.g. +998 90 123 45 67)
  if (cleanDigits.length >= 7) {
    saveTelegramUser(text, {
      id: from.id,
      username: from.username,
      firstName: from.first_name,
    });

    let matched = findSessionByPhoneOrCode(text);
    const otp = generateOtp();
    const ONE_MINUTE_MS = 60 * 1000;

    if (!matched) {
      matched = createSession({
        fullName: from.first_name || "Foydalanuvchi",
        phone: text,
        trackId: "ai-prompt",
        trackTitle: "Sun'iy Intellekt va Prompt Engineering",
      });
    }

    setOtpForSession(
      matched.sessionCode,
      otp,
      {
        id: from.id,
        username: from.username,
        firstName: from.first_name,
      },
      ONE_MINUTE_MS
    );

    const replyMsg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Salom, <b>${matched.fullName || from.first_name}</b>!
Raqamingiz aniqlandi: <code>+${normalizePhone(text)}</code>

━━━━━━━━━━━━━━━━━━━━━
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

⏱ <b>Amal qilish muddati: 1 daqiqa (60 soniya).</b>
💻 Ushbu kodni saytdagi oynaga kiriting!`;

    await sendTelegramMessage(chatId, replyMsg, "HTML", {
      remove_keyboard: true,
    });
    return { handled: true, sessionCode: matched.sessionCode, otp };
  }

  // 7. Fallback /help
  if (text === "/help" || text.toLowerCase() === "yordam") {
    await sendTelegramMessage(
      chatId,
      `ℹ️ <b>Ustoz AI Yordam:</b>\n\n1. <b>Kodni olish:</b> «📱 Telefon raqamni yuborish» tugmasini bosing yoki telefon raqamingizni yozing.\n2. <b>AI Ovozli Konsultant:</b> Istalgan vaqtda menga <b>ovozli xabar (voice note)</b> yuboring yoki qiziqishingizni yozing, sun'iy intellekt sizga eng mos kursni tanlab beradi!`
    );
    return { handled: true };
  }

  return { handled: false };
}
