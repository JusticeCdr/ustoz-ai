import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = getLeaderboard();
    return NextResponse.json({ ok: true, leaderboard: list });
  } catch (err: any) {
    console.error("Leaderboard API error:", err);
    return NextResponse.json({ ok: false, message: "Server xatosi" }, { status: 500 });
  }
}
