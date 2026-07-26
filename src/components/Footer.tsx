import React from 'react';
import { PageTab } from '../types';
import { GraduationCap, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                StudyVerse
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering university students with intelligent, simple English AI study tools for exam prep, assignment planning, and note summaries.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800/80">
              <Sparkles className="w-3.5 h-3.5" /> Simple English Explanations
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Study Tools</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-assistant"
                >
                  AI Study Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-planner"
                >
                  Assignment Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-quiz"
                >
                  Quiz Generator (MCQs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('summarizer')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-summarizer"
                >
                  Notes Summarizer
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Methods */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Core Principles</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Active Recall & Self-Testing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Spaced Repetition Schedules
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Feynman Technique (ELI5)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Zero Jargon & Clear Steps
              </li>
            </ul>
          </div>

          {/* Settings & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account & Settings</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-profile"
                >
                  Student Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-settings"
                >
                  Preferences & Dark Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="hover:text-blue-400 transition-colors"
                  id="footer-link-history"
                >
                  Clear Local History
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StudyVerse. Built for University Students.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" /> for efficient learning.
          </p>
        </div>
      </div>
    </footer>
  );
};
