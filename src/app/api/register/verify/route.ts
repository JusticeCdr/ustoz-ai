import { NextRequest, NextResponse } from "next/server";
import { verifySessionOtp, getSession } from "@/lib/store";
import { tgApi, handleTelegramUpdate, sendTelegramMessage } from "@/lib/telegram";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionCode, otp } = body;

    if (!sessionCode || !otp) {
      return NextResponse.json(
        { ok: false, message: "Seans kodi va tasdiqlash paroli kiritilishi shart." },
        { status: 400 }
      );
    }

    // Proactively pull updates in case user pressed /start and immediately typed OTP
    let session = getSession(sessionCode);
    if (session && !session.otpCode) {
      try {
        const updatesRes = await tgApi("getUpdates", { limit: 10, timeout: 0 });
        if (updatesRes.ok && Array.isArray(updatesRes.result)) {
          for (const u of updatesRes.result) {
            await handleTelegramUpdate(u);
          }
        }
      } catch (e) {
        console.error("verify sync updates error:", e);
      }
    }

    const result = verifySessionOtp(sessionCode, otp);

    if (!result.success || !result.session) {
      return NextResponse.json(
        { ok: false, message: result.error || "Tasdiqlash kodi mos kelmadi." },
        { status: 400 }
      );
    }

    const verifiedSession = result.session;
    const referralLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=ref_${verifiedSession.participantId}`;

    // Send congratulatory message to the user's Telegram if chatId is known
    if (verifiedSession.telegramUser?.id) {
      const congratsMsg = `🎉 <b>TABRIKLAYMIZ! RO'YXATDAN O'TISH MUVAFFAQIYATLI YAKUNLANDI!</b>

👤 <b>Ishtirokchi:</b> ${verifiedSession.fullName}
🆔 <b>ID Raqam:</b> <code>${verifiedSession.participantId}</code>
🎯 <b>Yo'nalish:</b> ${verifiedSession.trackTitle}
⚡ <b>Boshlang'ich Tajriba (XP):</b> +100 XP
🎫 <b>Status:</b> Tasdiqlangan Cyber Ishtirokchi

👥 <b>Do'stlaringizni taklif qiling va har bir do'stingiz uchun +50 XP oling:</b>
👉 <code>${referralLink}</code>

🏆 Veb-saytdan shaxsiy <b>Cyber Pass</b>ingizni yuklab oling va jonli reytingda yuqorilang!`;

      sendTelegramMessage(verifiedSession.telegramUser.id, congratsMsg).catch((err) =>
        console.error("Failed to send telegram congrats:", err)
      );
    }

    return NextResponse.json({
      ok: true,
      participant: {
        participantId: verifiedSession.participantId!,
        fullName: verifiedSession.fullName,
        phone: verifiedSession.phone,
        trackId: verifiedSession.trackId,
        trackTitle: verifiedSession.trackTitle,
        sessionCode: verifiedSession.sessionCode,
        xp: verifiedSession.xp || 100,
        referralCode: verifiedSession.referralCode || verifiedSession.participantId,
        referralLink,
        verifiedAt: verifiedSession.verifiedAt!,
        badge: "VERIFIED CYBER PARTICIPANT",
      },
      message: "Tabriklaymiz! Ro'yxatdan o'tish muvaffaqiyatli yakunlandi.",
    });
  } catch (err: any) {
    console.error("API /api/register/verify error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
