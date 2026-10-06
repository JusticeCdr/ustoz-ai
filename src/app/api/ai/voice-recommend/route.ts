import { NextRequest, NextResponse } from "next/server";
import { analyzeUserAudio, analyzeUserText } from "@/lib/ai-advisor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. If JSON with base64 audio or text
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.audioBase64) {
        const buffer = Buffer.from(body.audioBase64, "base64");
        const mimeType = body.mimeType || "audio/webm";
        const recommendation = await analyzeUserAudio(buffer, mimeType);
        return NextResponse.json({ ok: true, recommendation });
      }

      if (body.text) {
        const recommendation = await analyzeUserText(body.text);
        return NextResponse.json({ ok: true, recommendation });
      }

      return NextResponse.json(
        { ok: false, error: "Audio yoki matn yuborilmadi" },
        { status: 400 }
      );
    }

    // 2. If Multipart Form Data with File
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("audio") || formData.get("file");

      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const arrayBuffer = await (file as Blob).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = (file as Blob).type || "audio/webm";
        const recommendation = await analyzeUserAudio(buffer, mimeType);
        return NextResponse.json({ ok: true, recommendation });
      }

      // Check if text transcript was passed in form
      const transcript = formData.get("text");
      if (transcript && typeof transcript === "string") {
        const recommendation = await analyzeUserText(transcript);
        return NextResponse.json({ ok: true, recommendation });
      }

      return NextResponse.json(
        { ok: false, error: "Audio fayl topilmadi" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Noto'g'ri so'rov formati" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("AI Voice Recommend API error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Tahlil jarayonida xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
