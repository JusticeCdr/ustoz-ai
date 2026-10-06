import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCode } from "@/lib/auth";
import { tgApi, handleTelegramUpdate } from "@/lib/telegram";
import { getSession } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionCode, phone, otp, fullName, trackId, isLogin } = body;

    const identifier = sessionCode || phone;
    if (!identifier || !otp) {
      return NextResponse.json(
        { ok: false, message: "Telefon raqam yoki seans kodi va tasdiqlash paroli kiritilishi shart." },
        { status: 400 }
      );
    }

    // Sync any recent telegram messages in case user just pressed /start
    if (sessionCode) {
      const session = getSession(sessionCode);
      if (session && !session.otpCode) {
        try {
          const updatesRes = await tgApi("getUpdates", { limit: 10, timeout: 0 });
          if (updatesRes.ok && Array.isArray(updatesRes.result)) {
            for (const u of updatesRes.result) {
              await handleTelegramUpdate(u);
            }
          }
        } catch (e) {}
      }
    }

    const result = await verifyAuthCode({
      phoneOrSessionCode: identifier,
      otp: otp.trim(),
      fullName,
      trackId,
      isLogin: Boolean(isLogin),
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API /api/auth/verify error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
