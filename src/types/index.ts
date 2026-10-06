export type CareerTrackId =
  | "ai-prompt"
  | "fullstack-web3"
  | "cybersecurity"
  | "uiux-3d"
  | "datascience";

export interface CareerTrack {
  id: CareerTrackId;
  title: string;
  shortDesc: string;
  icon: string;
  color: string;
  gradient: string;
  neonBorder: string;
  glowColor: string;
  tags: string[];
  skills: string[];
  careerProspects: string;
  difficulty: "O'rta" | "Yuqori" | "Ekspert";
  popular?: boolean;
}

export interface PrizeItem {
  place: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  highlights: string[];
  glowClass: string;
  borderClass: string;
  gradient: string;
  featured?: boolean;
}

export interface TimelineStage {
  step: number;
  period: string;
  title: string;
  desc: string;
  status: "active" | "upcoming" | "completed";
  badge: string;
}

export interface RegistrationSession {
  sessionCode: string;
  fullName: string;
  phone: string;
  trackId: CareerTrackId;
  trackTitle: string;
  status: "INITIATED" | "WAITING_OTP" | "VERIFIED" | "EXPIRED";
  otpCode?: string;
  otpExpiresAt?: number;
  avatarUrl?: string;
  telegramUser?: {
    id: number;
    username?: string;
    firstName?: string;
  };
  participantId?: string;
  xp?: number;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
  createdAt: number;
  verifiedAt?: number;
}

export interface LeaderboardUser {
  rank: number;
  participantId: string;
  fullName: string;
  trackId: CareerTrackId;
  trackTitle: string;
  xp: number;
  referralCount: number;
  badge: string;
  avatarUrl?: string;
}

export interface AuthParticipant {
  participantId: string;
  fullName: string;
  phone: string;
  trackId: CareerTrackId;
  trackTitle: string;
  sessionCode?: string;
  xp: number;
  referralCode?: string;
  referralLink: string;
  verifiedAt: number;
  badge?: string;
  avatarUrl?: string;
  streakDays?: number;
  dailyQuestCompleted?: boolean;
  mockTestCompleted?: boolean;
  mockTestScore?: number;
  projectSubmission?: {
    link: string;
    notes: string;
    status: "tayyorgarlik" | "topshirildi" | "tekshiruvda" | "tasdiqlandi";
    submittedAt: number;
  };
  certificateUnlocked?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    description: string;
    trackId: CareerTrackId;
    points: {
      analytical: number;
      creative: number;
      logic: number;
      security: number;
    };
  }[];
}

export interface QuizResult {
  recommendedTrackId: CareerTrackId;
  matchScore: number;
  strengths: {
    analytical: number;
    creative: number;
    logic: number;
    security: number;
  };
}
