import { NextRequest, NextResponse } from "next/server";
import { requestAuthCode } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, fullName, trackId, isLogin, referredBy } = body;

    if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json(
        { ok: false, message: "Telefon raqamingizni to'g'ri formatda kiriting." },
        { status: 400 }
      );
    }

    if (!isLogin && (!fullName || typeof fullName !== "string" || fullName.trim().length < 2)) {
      return NextResponse.json(
        { ok: false, message: "Ism va familiyangizni to'liq kiriting (kamida 2 harf)." },
        { status: 400 }
      );
    }

    const result = await requestAuthCode({
      phone: phone.trim(),
      fullName: fullName ? fullName.trim() : undefined,
      trackId,
      isLogin: Boolean(isLogin),
      referredBy,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API /api/auth/send-code error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
