import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/store";
import { CAREER_TRACKS, TELEGRAM_BOT_USERNAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, trackId, referredBy } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { ok: false, message: "Ism va familiyangizni to'liq kiriting (kamida 2 harf)." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json(
        { ok: false, message: "Telefon raqamingizni to'g'ri formatda kiriting." },
        { status: 400 }
      );
    }

    const matchedTrack = CAREER_TRACKS.find((t) => t.id === trackId) || CAREER_TRACKS[0];

    const session = createSession({
      fullName: fullName.trim(),
      phone: phone.trim(),
      trackId: matchedTrack.id,
      trackTitle: matchedTrack.title,
      referredBy: referredBy || undefined,
    });

    const deepLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=verify_${session.sessionCode}`;

    return NextResponse.json({
      ok: true,
      sessionCode: session.sessionCode,
      botUsername: TELEGRAM_BOT_USERNAME,
      deepLink,
      expiresInSeconds: 600,
      trackTitle: matchedTrack.title,
    });
  } catch (err: any) {
    console.error("API /api/register/initiate error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
