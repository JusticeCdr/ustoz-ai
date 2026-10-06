import fs from "fs";
import path from "path";
import { CareerTrackId, RegistrationSession, LeaderboardUser } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const TG_USERS_FILE = path.join(DATA_DIR, "telegram_users.json");

// In-memory caches
const sessionsMap = new Map<string, RegistrationSession>();
const telegramUsersMap = new Map<string, { id: number; username?: string; firstName?: string; updatedAt: number }>();
let initialized = false;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create data directory:", err);
  }
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9) return `998${digits}`;
  if (digits.startsWith("998") && digits.length === 12) return digits;
  return digits;
}

const INITIAL_MOCK_LEADERBOARD: RegistrationSession[] = [
  {
    sessionCode: "MOCK01",
    fullName: "Azizbek Rahimov",
    phone: "+998901230001",
    trackId: "ai-prompt",
    trackTitle: "Sun'iy Intellekt va Prompt Engineering",
    status: "VERIFIED",
    participantId: "UZ-AI-2026-9041",
    xp: 650,
    referralCount: 11,
    createdAt: Date.now() - 86400000 * 2,
    verifiedAt: Date.now() - 86400000 * 2,
  },
  {
    sessionCode: "MOCK02",
    fullName: "Madina Ismoilova",
    phone: "+998901230002",
    trackId: "uiux-3d",
    trackTitle: "3D Motion & UI/UX Dizayn",
    status: "VERIFIED",
    participantId: "UZ-AI-2026-8812",
    xp: 500,
    referralCount: 8,
    createdAt: Date.now() - 86400000 * 3,
    verifiedAt: Date.now() - 86400000 * 3,
  },
  {
    sessionCode: "MOCK03",
    fullName: "Javohir Qodirov",
    phone: "+998901230003",
    trackId: "cybersecurity",
    trackTitle: "Kiberxavfsizlik va Axborot Himoyasi",
    status: "VERIFIED",
    participantId: "UZ-AI-2026-7734",
    xp: 450,
    referralCount: 7,
    createdAt: Date.now() - 86400000 * 1,
    verifiedAt: Date.now() - 86400000 * 1,
  },
  {
    sessionCode: "MOCK04",
    fullName: "Shohruh Mirzayev",
    phone: "+998901230004",
    trackId: "fullstack-web3",
    trackTitle: "Fullstack Dasturlash va Veb 3.0",
    status: "VERIFIED",
    participantId: "UZ-AI-2026-6520",
    xp: 350,
    referralCount: 5,
    createdAt: Date.now() - 86400000 * 2,
    verifiedAt: Date.now() - 86400000 * 2,
  },
  {
    sessionCode: "MOCK05",
    fullName: "Kamola Yusupova",
    phone: "+998901230005",
    trackId: "datascience",
    trackTitle: "Data Science va Sun'iy Idrok Tahlili",
    status: "VERIFIED",
    participantId: "UZ-AI-2026-5419",
    xp: 250,
    referralCount: 3,
    createdAt: Date.now() - 86400000 * 1,
    verifiedAt: Date.now() - 86400000 * 1,
  },
];

function loadSessionsFromFile() {
  if (initialized) return;
  try {
    ensureDataDir();
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      const list: RegistrationSession[] = JSON.parse(raw);
      list.forEach((s) => {
        sessionsMap.set(s.sessionCode.toUpperCase(), s);
        // Also populate telegram users map if available
        if (s.telegramUser?.id && s.phone) {
          const clean = normalizePhone(s.phone);
          if (!telegramUsersMap.has(clean)) {
            telegramUsersMap.set(clean, {
              id: s.telegramUser.id,
              username: s.telegramUser.username,
              firstName: s.telegramUser.firstName,
              updatedAt: s.verifiedAt || Date.now(),
            });
          }
        }
      });
    } else {
      INITIAL_MOCK_LEADERBOARD.forEach((s) => sessionsMap.set(s.sessionCode.toUpperCase(), s));
      saveSessionsToFile();
    }

    if (fs.existsSync(TG_USERS_FILE)) {
      const rawTg = fs.readFileSync(TG_USERS_FILE, "utf-8");
      const mapObj = JSON.parse(rawTg);
      Object.entries(mapObj).forEach(([phone, user]: [string, any]) => {
        telegramUsersMap.set(normalizePhone(phone), user);
      });
    }

    initialized = true;
  } catch (err) {
    console.error("Failed to load sessions from file:", err);
  }
}

function saveSessionsToFile() {
  try {
    ensureDataDir();
    const list = Array.from(sessionsMap.values());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save sessions to file:", err);
  }
}

function saveTelegramUsersToFile() {
  try {
    ensureDataDir();
    const obj: Record<string, any> = {};
    telegramUsersMap.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(TG_USERS_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save telegram users to file:", err);
  }
}

export function saveTelegramUser(
  phone: string,
  user: { id: number; username?: string; firstName?: string }
) {
  loadSessionsFromFile();
  const clean = normalizePhone(phone);
  if (!clean || clean.length < 7) return;

  telegramUsersMap.set(clean, {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    updatedAt: Date.now(),
  });
  saveTelegramUsersToFile();

  // Also link to any existing session with this phone
  for (const session of Array.from(sessionsMap.values())) {
    if (normalizePhone(session.phone) === clean) {
      session.telegramUser = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
      };
      saveSessionsToFile();
      break;
    }
  }
}

export function getTelegramUserByPhone(phone: string): {
  id: number;
  username?: string;
  firstName?: string;
} | null {
  loadSessionsFromFile();
  const clean = normalizePhone(phone);
  const found = telegramUsersMap.get(clean);
  if (found) return found;

  // Search through verified sessions
  for (const s of Array.from(sessionsMap.values())) {
    if (normalizePhone(s.phone) === clean && s.telegramUser?.id) {
      saveTelegramUser(clean, s.telegramUser);
      return s.telegramUser;
    }
  }

  // Suffix matching (e.g. without 998)
  for (const [tgPhone, u] of Array.from(telegramUsersMap.entries())) {
    if (tgPhone.endsWith(clean) || clean.endsWith(tgPhone)) {
      return u;
    }
  }

  return null;
}

export function generateSessionCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateParticipantId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `UZ-AI-2026-${num}`;
}

export function findVerifiedSessionByPhone(phone: string): RegistrationSession | null {
  loadSessionsFromFile();
  const clean = normalizePhone(phone);
  for (const session of Array.from(sessionsMap.values())) {
    if (session.status === "VERIFIED" && normalizePhone(session.phone) === clean) {
      return session;
    }
  }
  return null;
}

export function findSessionByPhoneOrCode(query: string): RegistrationSession | null {
  loadSessionsFromFile();
  const clean = query.trim();

  // Direct code match
  const byCode = getSession(clean);
  if (byCode) return byCode;

  // Participant ID match
  for (const session of Array.from(sessionsMap.values())) {
    if (
      session.participantId &&
      session.participantId.toLowerCase() === clean.toLowerCase()
    ) {
      return session;
    }
  }

  // Phone match
  const targetPhone = normalizePhone(clean);
  if (targetPhone.length >= 7) {
    for (const session of Array.from(sessionsMap.values())) {
      const sessionPhone = normalizePhone(session.phone);
      if (sessionPhone === targetPhone || sessionPhone.endsWith(targetPhone) || targetPhone.endsWith(sessionPhone)) {
        return session;
      }
    }
  }

  return null;
}

export function createSession(data: {
  fullName: string;
  phone: string;
  trackId: CareerTrackId;
  trackTitle: string;
  referredBy?: string;
}): RegistrationSession {
  loadSessionsFromFile();

  const cleanPhone = normalizePhone(data.phone);

  // Check if an existing session with same phone exists
  for (const existing of Array.from(sessionsMap.values())) {
    if (normalizePhone(existing.phone) === cleanPhone) {
      if (existing.status !== "VERIFIED") {
        existing.fullName = data.fullName.trim();
        existing.trackId = data.trackId;
        existing.trackTitle = data.trackTitle;
        existing.referredBy = data.referredBy;
      }
      saveSessionsToFile();
      return existing;
    }
  }

  let sessionCode = generateSessionCode();
  while (sessionsMap.has(sessionCode)) {
    sessionCode = generateSessionCode();
  }

  const session: RegistrationSession = {
    sessionCode,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    trackId: data.trackId,
    trackTitle: data.trackTitle,
    referredBy: data.referredBy,
    status: "INITIATED",
    createdAt: Date.now(),
  };

  sessionsMap.set(sessionCode, session);
  saveSessionsToFile();
  return session;
}

export function getSession(sessionCode: string): RegistrationSession | null {
  loadSessionsFromFile();
  const code = sessionCode.replace(/^verify_/i, "").trim().toUpperCase();
  return sessionsMap.get(code) || null;
}

export function setOtpForSession(
  sessionCode: string,
  otpCode: string,
  telegramUser?: { id: number; username?: string; firstName?: string },
  expiresInMs: number = 60 * 1000 // Default: 1 minute (60 seconds)
): RegistrationSession | null {
  loadSessionsFromFile();
  const code = sessionCode.replace(/^verify_/i, "").trim().toUpperCase();
  let session = sessionsMap.get(code);

  if (!session) {
    session = {
      sessionCode: code,
      fullName: telegramUser?.firstName || "Telegram Foydalanuvchisi",
      phone: "+998 -- --- -- --",
      trackId: "ai-prompt",
      trackTitle: "Sun'iy Intellekt va Prompt Engineering",
      status: "WAITING_OTP",
      otpCode,
      otpExpiresAt: Date.now() + expiresInMs,
      telegramUser,
      createdAt: Date.now(),
    };
    sessionsMap.set(code, session);
    saveSessionsToFile();
    return session;
  }

  session.otpCode = otpCode;
  session.otpExpiresAt = Date.now() + expiresInMs;
  session.status = "WAITING_OTP";
  if (telegramUser) {
    session.telegramUser = telegramUser;
    if (session.phone) {
      saveTelegramUser(session.phone, telegramUser);
    }
  }

  sessionsMap.set(code, session);
  saveSessionsToFile();
  return session;
}

export function verifySessionOtp(
  sessionCodeOrPhone: string,
  enteredOtp: string,
  meta?: { fullName?: string; trackId?: CareerTrackId; trackTitle?: string }
): { success: boolean; session?: RegistrationSession; error?: string } {
  loadSessionsFromFile();
  const session = findSessionByPhoneOrCode(sessionCodeOrPhone);

  if (!session) {
    return { success: false, error: "Ro'yxatdan o'tish seansi topilmadi yoki eskirgan." };
  }

  if (!session.otpCode) {
    return {
      success: false,
      error: "Tasdiqlash kodi hali olinmagan. Iltimos, Telegram orqali kodni so'rang.",
    };
  }

  // Check 1-minute expiration
  if (session.otpExpiresAt && Date.now() > session.otpExpiresAt) {
    return {
      success: false,
      error: "Tasdiqlash kodining amal qilish muddati (1 daqiqa) tugagan! Iltimos yangi kod oling.",
    };
  }

  if (session.otpCode.trim() !== enteredOtp.trim()) {
    return { success: false, error: "Kiritilgan 6 xonali tasdiqlash kodi noto'g'ri!" };
  }

  // Verification successful!
  session.status = "VERIFIED";
  session.verifiedAt = Date.now();
  if (meta?.fullName) session.fullName = meta.fullName;
  if (meta?.trackId) session.trackId = meta.trackId;
  if (meta?.trackTitle) session.trackTitle = meta.trackTitle;

  if (!session.participantId) {
    session.participantId = generateParticipantId();
  }
  session.xp = session.xp || 100;
  session.referralCode = session.participantId;
  session.referralCount = session.referralCount || 0;

  // Reward referrer if applicable
  if (session.referredBy) {
    for (const other of Array.from(sessionsMap.values())) {
      if (other.participantId === session.referredBy || other.referralCode === session.referredBy) {
        other.xp = (other.xp || 100) + 50;
        other.referralCount = (other.referralCount || 0) + 1;
        break;
      }
    }
  }

  sessionsMap.set(session.sessionCode.toUpperCase(), session);
  saveSessionsToFile();
  return { success: true, session };
}

export function updateUserProfile(
  identifier: string,
  updates: { fullName?: string; avatarUrl?: string }
): { ok: boolean; session?: RegistrationSession; error?: string } {
  loadSessionsFromFile();
  const session = findSessionByPhoneOrCode(identifier);
  if (!session) {
    return { ok: false, error: "Foydalanuvchi topilmadi." };
  }

  if (updates.fullName && updates.fullName.trim().length >= 2) {
    session.fullName = updates.fullName.trim();
  }
  if (updates.avatarUrl !== undefined) {
    session.avatarUrl = updates.avatarUrl;
  }

  sessionsMap.set(session.sessionCode.toUpperCase(), session);
  saveSessionsToFile();
  return { ok: true, session };
}

export function getLeaderboard(): LeaderboardUser[] {
  loadSessionsFromFile();
  const verifiedList = Array.from(sessionsMap.values()).filter(
    (s) => s.status === "VERIFIED" && s.participantId
  );

  verifiedList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return verifiedList.map((s, idx) => ({
    rank: idx + 1,
    participantId: s.participantId!,
    fullName: s.fullName,
    trackId: s.trackId,
    trackTitle: s.trackTitle,
    xp: s.xp || 100,
    referralCount: s.referralCount || 0,
    avatarUrl: s.avatarUrl,
    badge:
      idx === 0
        ? "Oltin Kiber Lider"
        : idx === 1
        ? "Kumush Challenger"
        : idx === 2
        ? "Bronza Strateg"
        : "Cyber Ishtirokchi",
  }));
}
