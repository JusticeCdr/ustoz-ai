import { NextRequest, NextResponse } from "next/server";
import { handleTelegramUpdate, tgApi } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    console.log("Received Telegram Webhook Update ID:", update?.update_id);
    const result = await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const me = await tgApi("getMe");
  const webhookInfo = await tgApi("getWebhookInfo");
  return NextResponse.json({
    ok: true,
    bot: me?.result || null,
    webhook: webhookInfo?.result || null,
    status: "Telegram Bot handler online",
  });
}
