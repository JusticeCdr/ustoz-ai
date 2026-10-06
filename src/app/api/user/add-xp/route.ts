import { NextRequest, NextResponse } from "next/server";
import { addUserXp, findSessionByPhoneOrCode } from "@/lib/store";
import { formatAuthParticipant } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, xp, reason } = body;

    if (!identifier) {
      return NextResponse.json(
        { ok: false, message: "Foydalanuvchi identifikatori ko'rsatilmadi." },
        { status: 400 }
      );
    }

    const xpAmount = Number(xp);
    if (isNaN(xpAmount) || xpAmount <= 0) {
      return NextResponse.json(
        { ok: false, message: "Yaroqli XP miqdori kiritilmadi." },
        { status: 400 }
      );
    }

    const result = addUserXp(identifier, xpAmount);

    if (!result.ok || !result.session) {
      return NextResponse.json(
        { ok: false, message: result.error || "XP qo'shishda xatolik yuz berdi." },
        { status: 400 }
      );
    }

    const participant = formatAuthParticipant(result.session);

    return NextResponse.json({
      ok: true,
      participant,
      addedXp: xpAmount,
      newXp: participant.xp,
      reason: reason || "Cyber Mini-Game mukofoti",
      message: `${xpAmount} XP muvaffaqiyatli qo'shildi! Yangi reyting balingiz: ${participant.xp} XP.`,
    });
  } catch (err: any) {
    console.error("API /api/user/add-xp error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
