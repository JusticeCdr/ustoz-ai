import { NextRequest, NextResponse } from "next/server";
import { updateUserProfile, findSessionByPhoneOrCode } from "@/lib/store";
import { formatAuthParticipant } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, fullName, avatarUrl } = body;

    if (!identifier) {
      return NextResponse.json(
        { ok: false, message: "Foydalanuvchi identifikatori ko'rsatilmadi." },
        { status: 400 }
      );
    }

    const result = updateUserProfile(identifier, {
      fullName,
      avatarUrl,
    });

    if (!result.ok || !result.session) {
      return NextResponse.json(
        { ok: false, message: result.error || "Profilni yangilashda xatolik." },
        { status: 400 }
      );
    }

    const participant = formatAuthParticipant(result.session);

    return NextResponse.json({
      ok: true,
      participant,
      message: "Profil muvaffaqiyatli yangilandi!",
    });
  } catch (err: any) {
    console.error("API /api/user/profile error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("identifier");

    if (!identifier) {
      return NextResponse.json({ ok: false, message: "identifier kerak." }, { status: 400 });
    }

    const session = findSessionByPhoneOrCode(identifier);
    if (!session) {
      return NextResponse.json({ ok: false, message: "Foydalanuvchi topilmadi." }, { status: 404 });
    }

    const participant = formatAuthParticipant(session);
    return NextResponse.json({ ok: true, participant });
  } catch (err: any) {
    console.error("API GET /api/user/profile error:", err);
    return NextResponse.json({ ok: false, message: "Server xatosi" }, { status: 500 });
  }
}
