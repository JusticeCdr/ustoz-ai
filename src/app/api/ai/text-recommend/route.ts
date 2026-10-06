import { NextRequest, NextResponse } from "next/server";
import { analyzeUserText } from "@/lib/ai-advisor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body?.text || "";

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Matn kiritilmadi" },
        { status: 400 }
      );
    }

    const recommendation = await analyzeUserText(text);
    return NextResponse.json({ ok: true, recommendation });
  } catch (err: any) {
    console.error("AI Text Recommend API error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Tahlil jarayonida xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
