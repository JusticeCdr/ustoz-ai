/**
 * Telegram Long Polling Bot Daemon for Ustoz AI
 * Run with: npm run bot
 */
import { handleTelegramUpdate, tgApi } from "../src/lib/telegram";

async function startBot() {
  console.log("⚡ Ustoz AI Telegram Bot Polling Xizmati ishga tushmoqda...");
  const me = await tgApi("getMe");
  if (!me.ok) {
    console.error("Telegram botga ulanib bo'lmadi:", me);
    return;
  }

  console.log(`🤖 Bot muvaffaqiyatli ulandi: @${me.result.username} (${me.result.first_name})`);

  // Webhookni tozalash (polling bilan to'qnashmasligi uchun)
  await tgApi("deleteWebhook");

  let offset = 0;

  while (true) {
    try {
      const data = await tgApi("getUpdates", {
        offset,
        timeout: 25,
        limit: 100,
      });

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleTelegramUpdate(update);
        }
      }
    } catch (loopErr) {
      console.error("Polling xatosi:", loopErr);
      await new Promise((r) => setTimeout(r, 2500));
    }
  }
}

startBot();
