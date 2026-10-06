import {
  createSession,
  findSessionByPhoneOrCode,
  findVerifiedSessionByPhone,
  generateOtp,
  getTelegramUserByPhone,
  normalizePhone,
  setOtpForSession,
  verifySessionOtp,
  updateUserProfile,
} from "./store";
import { sendTelegramMessage } from "./telegram";
import { TELEGRAM_BOT_USERNAME, CAREER_TRACKS } from "./constants";
import { CareerTrackId, AuthParticipant, RegistrationSession } from "@/types";

export function formatAuthParticipant(session: RegistrationSession): AuthParticipant {
  return {
    participantId: session.participantId || "UZ-AI-2026-0000",
    fullName: session.fullName,
    phone: session.phone,
    trackId: session.trackId,
    trackTitle: session.trackTitle,
    sessionCode: session.sessionCode,
    xp: session.xp || 100,
    referralCode: session.referralCode || session.participantId,
    referralLink: `https://t.me/${TELEGRAM_BOT_USERNAME}?start=ref_${session.participantId}`,
    verifiedAt: session.verifiedAt || Date.now(),
    badge: "VERIFIED CYBER PARTICIPANT",
    avatarUrl: session.avatarUrl,
  };
}

export async function requestAuthCode(params: {
  phone: string;
  fullName?: string;
  trackId?: CareerTrackId;
  isLogin?: boolean;
  referredBy?: string;
}) {
  const cleanPhone = normalizePhone(params.phone);
  if (!cleanPhone || cleanPhone.length < 9) {
    return { ok: false, message: "Telefon raqam noto'g'ri kiritilgan." };
  }

  const existingVerified = findVerifiedSessionByPhone(cleanPhone);

  if (params.isLogin && !existingVerified) {
    return {
      ok: false,
      message: "Ushbu telefon raqam bilan ro'yxatdan o'tgan akkaunt topilmadi. Iltimos, avval ro'yxatdan o'ting.",
    };
  }

  // Find or create session
  const matchedTrack = CAREER_TRACKS.find((t) => t.id === params.trackId) || CAREER_TRACKS[0];
  const session = createSession({
    fullName: params.fullName || existingVerified?.fullName || "Foydalanuvchi",
    phone: params.phone,
    trackId: matchedTrack.id,
    trackTitle: matchedTrack.title,
    referredBy: params.referredBy,
  });

  const otp = generateOtp();
  const ONE_MINUTE_MS = 60 * 1000;

  // Check if we have a linked Telegram chatId for this phone
  const tgUser = getTelegramUserByPhone(cleanPhone);

  if (tgUser && tgUser.id) {
    // Send directly to their Telegram
    setOtpForSession(session.sessionCode, otp, tgUser, ONE_MINUTE_MS);

    const greetingName = params.fullName || existingVerified?.fullName || tgUser.firstName || "Ishtirokchi";
    const actionText = params.isLogin ? "Akkauntingizga kirish uchun" : "Ro'yxatdan o'tishni tasdiqlash uchun";

    const msg = `⚡ <b>USTOZ AI — TASDIQLASH KODI</b> ⚡

Assalomu alaykum, <b>${greetingName}</b>!
${actionText} bir martalik tasdiqlash parolingiz:

━━━━━━━━━━━━━━━━━━━━━
👉 <code>${otp}</code> 👈
━━━━━━━━━━━━━━━━━━━━━

⏱ <b>Amal qilish muddati: 1 daqiqa (60 soniya).</b>
💻 Ushbu kodni saytdagi oynaga kiriting!`;

    await sendTelegramMessage(tgUser.id, msg, "HTML");

    return {
      ok: true,
      sent: true,
      sessionCode: session.sessionCode,
      phone: session.phone,
      expiresInSeconds: 60,
      isExistingUser: Boolean(existingVerified),
      message: "Tasdiqlash kodi Telegram botingizga yuborildi!",
    };
  } else {
    // Ask user to click Start in Telegram bot
    setOtpForSession(session.sessionCode, otp, undefined, ONE_MINUTE_MS);
    const botUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=auth_${cleanPhone}`;

    return {
      ok: true,
      sent: false,
      requiresBotStart: true,
      botUrl,
      botUsername: TELEGRAM_BOT_USERNAME,
      sessionCode: session.sessionCode,
      phone: session.phone,
      expiresInSeconds: 60,
      isExistingUser: Boolean(existingVerified),
      message: "Tasdiqlash kodini qabul qilish uchun Telegram botimizda Start bosing.",
    };
  }
}

export async function verifyAuthCode(params: {
  phoneOrSessionCode: string;
  otp: string;
  fullName?: string;
  trackId?: CareerTrackId;
  isLogin?: boolean;
}) {
  const result = verifySessionOtp(params.phoneOrSessionCode, params.otp, {
    fullName: params.fullName,
    trackId: params.trackId,
  });

  if (!result.success || !result.session) {
    return {
      ok: false,
      message: result.error || "Tasdiqlash kodi mos kelmadi.",
    };
  }

  const session = result.session;
  const participant = formatAuthParticipant(session);

  // Send congrats to Telegram if chatId is known
  if (session.telegramUser?.id) {
    const welcomeWord = params.isLogin ? "XUSH KELIBSIZ!" : "TABRIKLAYMIZ!";
    const bodyWord = params.isLogin
      ? "Siz muvaffaqiyatli akkauntingizga kirdingiz."
      : "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi va sizga <b>Cyber Pass</b> berildi!";

    const congratsMsg = `🎉 <b>USTOZ AI — ${welcomeWord}</b>

👤 <b>Ishtirokchi:</b> ${session.fullName}
🆔 <b>ID Raqam:</b> <code>${participant.participantId}</code>
🎯 <b>Yo'nalish:</b> ${session.trackTitle}
⚡ <b>Reyting Tajribasi (XP):</b> ${participant.xp} XP

${bodyWord}
🌐 Veb-saytdan shaxsiy profilingizni boshqaring va reytingda yuqorilang!`;

    sendTelegramMessage(session.telegramUser.id, congratsMsg).catch(() => {});
  }

  return {
    ok: true,
    participant,
    message: params.isLogin ? "Tizimga muvaffaqiyatli kirdingiz!" : "Tabriklaymiz! Ro'yxatdan o'tdingiz.",
  };
}
