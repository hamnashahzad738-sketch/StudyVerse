import React, { useState, useEffect } from 'react';
import { PageTab, ChatMessage, StudySchedule, Quiz, NotesSummary, UserSettings, UserProfile } from './types';
import { askAI } from "./lib/gemini";
import {
  getStoredSettings,
  setStoredSettings,
  getStoredChat,
  setStoredChat,
  getStoredPlans,
  setStoredPlans,
  getStoredQuizzes,
  setStoredQuizzes,
  getStoredSummaries,
  setStoredSummaries,
  getStoredProfile,
  setStoredProfile,
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AssistantPage } from './components/AssistantPage';
import { PlannerPage } from './components/PlannerPage';
import { QuizPage } from './components/QuizPage';
import { SummarizerPage } from './components/SummarizerPage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');

  // Persistent States
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(getStoredChat);
  const [savedPlans, setSavedPlans] = useState<StudySchedule[]>(getStoredPlans);
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>(getStoredQuizzes);
  const [savedSummaries, setSavedSummaries] = useState<NotesSummary[]>(getStoredSummaries);

  // Apply dark mode class to html document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredSettings(settings);
  }, [settings]);

  // Sync profile to storage
  useEffect(() => {
    setStoredProfile(profile);
  }, [profile]);

  // Sync states to storage
  useEffect(() => {
    setStoredChat(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    setStoredPlans(savedPlans);
  }, [savedPlans]);

  useEffect(() => {
    setStoredQuizzes(savedQuizzes);
  }, [savedQuizzes]);

  useEffect(() => {
    setStoredSummaries(savedSummaries);
  }, [savedSummaries]);

  const handleClearAllData = () => {
    setChatHistory([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: "👋 Hi! I'm StudyVerse, your university study assistant. Ask me anything in simple English!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setSavedPlans([]);
    setSavedQuizzes([]);
    setSavedSummaries([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={settings.darkMode}
          setDarkMode={(val) => setSettings({ ...settings, darkMode: val })}
          profile={profile}
        />

        <main className="py-8">
          {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} />}

          {activeTab === 'assistant' && (
            <AssistantPage
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              settings={settings}
              setSettings={setSettings}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerPage
              savedPlans={savedPlans}
              setSavedPlans={setSavedPlans}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizPage
              savedQuizzes={savedQuizzes}
              setSavedQuizzes={setSavedQuizzes}
            />
          )}

          {activeTab === 'summarizer' && (
            <SummarizerPage
              savedSummaries={savedSummaries}
              setSavedSummaries={setSavedSummaries}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              chatHistory={chatHistory}
              savedQuizzes={savedQuizzes}
              savedSummaries={savedSummaries}
              savedPlans={savedPlans}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              setSettings={setSettings}
              onClearData={handleClearAllData}
            />
          )}
        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
const handleSendWithAI = async (userMessage: string) => {
  const aiResponse = await askAI(userMessage);
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    text: aiResponse,
    sender: 'ai',
    timestamp: new Date()
  };
  setStoredChat(prev => [...prev, newMessage]);
};
