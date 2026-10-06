import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Kod kiritilmadi" }, { status: 400 });
    }

    if (language !== "python") {
      return NextResponse.json({
        success: true,
        output: "HTML va CSS brauzerda jonli vizual tarzda aks ettiriladi.",
      });
    }

    // Safety checks against dangerous system commands in student code
    const dangerousTokens = ["import os", "import subprocess", "import shutil", "os.system", "shutil.rmtree", "__import__('os')"];
    for (const token of dangerousTokens) {
      if (code.includes(token)) {
        return NextResponse.json({
          success: false,
          error: "Xavfsizlik cheklovi: Tizim kutubxonalaridan foydalanish taqiqlangan.",
        });
      }
    }

    // Create temporary file in OS temp directory
    const tempDir = os.tmpdir();
    const tempFileName = `ustoz_py_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.py`;
    const tempFilePath = path.join(tempDir, tempFileName);

    await fs.promises.writeFile(tempFilePath, code, "utf-8");

    // Execute with python with strict 3-second timeout
    const result = await new Promise<{ stdout: string; stderr: string; timedOut: boolean }>(
      (resolve) => {
        const child = exec(
          `python "${tempFilePath}"`,
          { timeout: 3500, maxBuffer: 1024 * 64 },
          (err, stdout, stderr) => {
            resolve({
              stdout: stdout || "",
              stderr: stderr || (err ? err.message : ""),
              timedOut: !!(err && (err as any).killed),
            });
          }
        );
      }
    );

    // Clean up temp file
    try {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    } catch (e) {}

    if (result.timedOut) {
      return NextResponse.json({
        success: false,
        error: "Vaqt chegarasi tugadi (Timeout): Cheksiz tsikl (infinite loop) yuz bergan bo'lishi mumkin.",
      });
    }

    if (result.stderr && !result.stdout) {
      return NextResponse.json({
        success: false,
        error: result.stderr,
      });
    }

    return NextResponse.json({
      success: true,
      output: result.stdout || "(Dastur muvaffaqiyatli bajarildi, ammo hech qanday matn chiqarilmadi)",
      stderr: result.stderr,
    });
  } catch (err: any) {
    console.error("Code runner API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Kodni ishga tushirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
