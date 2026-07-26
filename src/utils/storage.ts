import { ChatMessage, StudySchedule, Quiz, NotesSummary, UserSettings, UserProfile } from "../types";

const STORAGE_KEYS = {
  CHAT: "campusmate_chat_history",
  PLANS: "campusmate_saved_plans",
  QUIZZES: "campusmate_quizzes",
  SUMMARIES: "campusmate_summaries",
  SETTINGS: "campusmate_user_settings",
  PROFILE: "campusmate_user_profile",
};

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading profile", e);
  }
  return {
    name: "Alex Smith",
    university: "Stanford University",
    major: "Computer Science & Engineering",
    semester: "Fall 2026 (Semester 5)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  };
};

export const setStoredProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Error saving profile", e);
  }
};

export const getStoredSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading settings", e);
  }
  return {
    darkMode: false,
    simpleLanguage: true,
    clearHistoryOnExit: false,
    autoSave: true,
  };
};

export const setStoredSettings = (settings: UserSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings", e);
  }
};

export const getStoredChat = (): ChatMessage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading chat history", e);
  }
  return [
    {
      id: "welcome-msg",
      sender: "ai",
      text: "👋 Hi! I'm StudyVerse, your university study assistant. Ask me anything about your lectures, math problems, code debugging, or essay outlines in simple English!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ];
};

export const setStoredChat = (chat: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chat));
  } catch (e) {
    console.error("Error saving chat history", e);
  }
};

export const getStoredPlans = (): StudySchedule[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading plans", e);
  }
  return [];
};

export const setStoredPlans = (plans: StudySchedule[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error("Error saving plans", e);
  }
};

export const getStoredQuizzes = (): Quiz[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading quizzes", e);
  }
  return [];
};

export const setStoredQuizzes = (quizzes: Quiz[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  } catch (e) {
    console.error("Error saving quizzes", e);
  }
};

export const getStoredSummaries = (): NotesSummary[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading summaries", e);
  }
  return [];
};

export const setStoredSummaries = (summaries: NotesSummary[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
  } catch (e) {
    console.error("Error saving summaries", e);
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error("Error clearing storage", e);
  }
};
