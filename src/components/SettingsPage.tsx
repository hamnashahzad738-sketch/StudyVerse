import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { clearAllData } from '../utils/storage';
import { 
  Settings, 
  Moon, 
  Sun, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  RefreshCw,
  Server
} from 'lucide-react';

interface SettingsPageProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onClearData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  setSettings,
  onClearData,
}) => {
  const [clearedMessage, setClearedMessage] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ status: string; aiEnabled: boolean } | null>(null);
  const [checkingServer, setCheckingServer] = useState(false);

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    setCheckingServer(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setServerStatus(data);
    } catch (e) {
      setServerStatus({ status: 'offline', aiEnabled: false });
    } finally {
      setCheckingServer(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat messages, study schedules, quizzes, and summaries?')) {
      clearAllData();
      onClearData();
      setClearedMessage(true);
      setTimeout(() => setClearedMessage(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-blue-100 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-600" /> Preferences & Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          Manage theme preferences, simple language explanations, local storage, and server status.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {settings.darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            Appearance & Dark Mode
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Dark Theme</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Enable comfortable dark palette for late night study sessions</div>
            </div>

            <button
              onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              id="settings-darkmode-toggle"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* AI Language Preference */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> AI Language Tone
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Simple English (ELI5) Explanations</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Always prioritize simple terms, step-by-step logic, and analogies over heavy academic jargon
              </div>
            </div>

            <button
              onClick={() => setSettings((s) => ({ ...s, simpleLanguage: !s.simpleLanguage }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.simpleLanguage ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              id="settings-simple-lang-toggle"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.simpleLanguage ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Server & Connectivity Status */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" /> StudyVerse Server Status
            </h3>

            <button
              onClick={checkServerHealth}
              disabled={checkingServer}
              className="p-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingServer ? 'animate-spin' : ''}`} /> Check
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">Backend Health Status:</div>
              <div className="text-slate-500 dark:text-slate-400">
                {serverStatus ? `Status: ${serverStatus.status}` : 'Connecting...'}
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Server Connected</span>
            </div>
          </div>
        </div>

        {/* Local Storage & History */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-red-100 dark:border-red-950/50 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Data & History Management
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All your chat messages, saved study schedules, generated quizzes, and notes summaries are stored securely in your browser's local storage.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleClearHistory}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
              id="settings-clear-all-data-btn"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Local History</span>
            </button>

            {clearedMessage && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All local history successfully cleared!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
