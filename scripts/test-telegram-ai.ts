import { handleTelegramUpdate } from "../src/lib/telegram";

async function testTelegramAI() {
  console.log("=========================================");
  console.log("🤖 TELEGRAM BOT AI INTEGRATSIYASI TESTI");
  console.log("=========================================\n");

  // 1. Test career text inquiry via Telegram
  console.log("1. Matnli karyera maslahati so'rovi:");
  const textUpdate = {
    update_id: 10001,
    message: {
      message_id: 501,
      from: { id: 99887766, first_name: "Rustam", username: "rustam_coder" },
      chat: { id: 99887766, type: "private" },
      date: Math.floor(Date.now() / 1000),
      text: "Salom, men 3D grafika, Figma va dizayn kurslariga qiziqaman, qaysi yo'nalish yaxshi?",
    },
  };

  const textRes = await handleTelegramUpdate(textUpdate);
  console.log("Natija:", textRes);

  console.log("\n2. /ai buyrug'i so'rovi:");
  const aiCmdUpdate = {
    update_id: 10002,
    message: {
      message_id: 502,
      from: { id: 99887766, first_name: "Rustam", username: "rustam_coder" },
      chat: { id: 99887766, type: "private" },
      date: Math.floor(Date.now() / 1000),
      text: "/ai Men sun'iy intellekt va neyrotarmoqlarga qiziqaman",
    },
  };

  const cmdRes = await handleTelegramUpdate(aiCmdUpdate);
  console.log("Natija:", cmdRes);

  console.log("\n✅ Telegram bot AI tekshiruvi muvaffaqiyatli o'tdi!");
}

testTelegramAI().catch(console.error);
