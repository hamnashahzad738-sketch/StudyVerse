export type PageTab = 'home' | 'assistant' | 'planner' | 'quiz' | 'summarizer' | 'settings' | 'profile';

export interface UserProfile {
  name: string;
  university: string;
  major: string;
  semester: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  topicTag?: string;
  isError?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  category: 'reading' | 'practice' | 'writing' | 'review' | 'break';
}

export interface StudyDay {
  dayNumber: number;
  dateStr: string;
  focusTitle: string;
  dailyHours: number;
  tasks: TaskItem[];
}

export interface StudySchedule {
  id: string;
  subject: string;
  assignmentTitle: string;
  deadline: string;
  totalHours: number;
  hoursPerDay: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  overview: string;
  days: StudyDay[];
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
  createdAt: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface NotesSummary {
  id: string;
  title: string;
  executiveSummary: string;
  keyTakeaways: string[];
  terms: GlossaryTerm[];
  flashcards: Flashcard[];
  actionItems: string[];
  createdAt: string;
}

export interface UserSettings {
  darkMode: boolean;
  simpleLanguage: boolean;
  clearHistoryOnExit: boolean;
  autoSave: boolean;
}
