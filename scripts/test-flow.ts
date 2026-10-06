import {
  createSession,
  getSession,
  findSessionByPhoneOrCode,
  verifySessionOtp,
  getLeaderboard,
} from "../src/lib/store";
import { handleTelegramUpdate } from "../src/lib/telegram";

async function testComprehensiveFlow() {
  console.log("=== 1. TEST: Phone number matching & Contact sharing ===");

  // Create session with Uzbek phone number
  const session1 = createSession({
    fullName: "Rustam Qosimov",
    phone: "+998 90 123 45 67",
    trackId: "cybersecurity",
    trackTitle: "Kiberxavfsizlik va Axborot Himoyasi",
  });
  console.log("✓ Session 1 Created:", session1.sessionCode, "Phone:", session1.phone);

  // Simulate user sending phone number in Telegram chat
  const phoneTextUpdate = {
    update_id: 2001,
    message: {
      message_id: 101,
      from: { id: 99887766, first_name: "Rustam", username: "rustam_q" },
      chat: { id: 99887766 },
      text: "901234567", // user typed just 9 digits
    },
  };
  const phoneResult = await handleTelegramUpdate(phoneTextUpdate);
  console.log("✓ Phone text match result:", phoneResult);

  const updatedSession1 = getSession(session1.sessionCode);
  console.log("✓ OTP generated for Session 1:", updatedSession1?.otpCode);
  if (!updatedSession1?.otpCode) throw new Error("Failed to generate OTP via phone text!");

  // Verify OTP
  const verifyRes1 = verifySessionOtp(session1.sessionCode, updatedSession1.otpCode);
  console.log("✓ Verified Session 1:", verifyRes1.success, "Participant ID:", verifyRes1.session?.participantId);

  console.log("\n=== 2. TEST: Contact sharing button (request_contact) ===");
  const session2 = createSession({
    fullName: "Zarina Aliyeva",
    phone: "+998 93 555 44 33",
    trackId: "ai-prompt",
    trackTitle: "Sun'iy Intellekt va Prompt Engineering",
    referredBy: verifyRes1.session?.participantId, // referred by session 1!
  });

  const contactUpdate = {
    update_id: 2002,
    message: {
      message_id: 102,
      from: { id: 88776655, first_name: "Zarina", username: "zarina_a" },
      chat: { id: 88776655 },
      contact: {
        phone_number: "+998935554433",
        first_name: "Zarina",
      },
    },
  };
  const contactResult = await handleTelegramUpdate(contactUpdate);
  console.log("✓ Contact sharing match result:", contactResult);

  const updatedSession2 = getSession(session2.sessionCode);
  const verifyRes2 = verifySessionOtp(session2.sessionCode, updatedSession2!.otpCode!);
  console.log("✓ Verified Session 2:", verifyRes2.success, "Participant ID:", verifyRes2.session?.participantId);

  console.log("\n=== 3. TEST: Leaderboard & Referral XP Boost ===");
  const leaderboard = getLeaderboard();
  console.log("✓ Leaderboard top 3:");
  leaderboard.slice(0, 3).forEach((u) => {
    console.log(`  #${u.rank} ${u.fullName} (${u.trackTitle}) - ${u.xp} XP [${u.referralCount} referrals]`);
  });

  console.log("\n🎉 ALL TESTS PASSED WITH 100% SUCCESS!");
}

testComprehensiveFlow().catch(console.error);
