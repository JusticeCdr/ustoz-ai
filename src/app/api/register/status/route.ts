import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/store";
import { tgApi, handleTelegramUpdate } from "@/lib/telegram";

export const dynamic = "force-dynamic";

let lastUpdateId = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionCode = searchParams.get("sessionCode");

    if (!sessionCode) {
      return NextResponse.json({ ok: false, message: "sessionCode talab qilinadi." }, { status: 400 });
    }

    let session = getSession(sessionCode);

    // If session is waiting for OTP, let's proactively poll telegram getUpdates
    // so localhost users don't need ngrok or manual bot runner!
    if (session && session.status === "INITIATED") {
      try {
        const updatesRes = await tgApi("getUpdates", {
          offset: lastUpdateId + 1,
          limit: 10,
          timeout: 0,
        });

        if (updatesRes.ok && Array.isArray(updatesRes.result)) {
          for (const u of updatesRes.result) {
            lastUpdateId = Math.max(lastUpdateId, u.update_id);
            await handleTelegramUpdate(u);
          }
          // Reload updated session
          session = getSession(sessionCode);
        }
      } catch (pollErr) {
        console.error("Proactive polling error:", pollErr);
      }
    }

    if (!session) {
      return NextResponse.json({ ok: false, message: "Seans topilmadi." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      status: session.status,
      sessionCode: session.sessionCode,
      hasOtpGenerated: Boolean(session.otpCode),
      telegramUser: session.telegramUser || null,
      participantId: session.participantId || null,
    });
  } catch (err: any) {
    console.error("API /api/register/status error:", err);
    return NextResponse.json({ ok: false, message: "Server xatosi" }, { status: 500 });
  }
}
