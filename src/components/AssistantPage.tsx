import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserSettings } from '../types';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Trash2, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  BookOpen,
  Code,
  Calculator,
  PenTool
} from 'lucide-react';

interface AssistantPageProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({
  chatHistory,
  setChatHistory,
  settings,
  setSettings,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    {
      icon: Code,
      title: 'Programming & CS',
      prompt: 'Explain how binary search trees work with a simple Python code example.',
    },
    {
      icon: Calculator,
      title: 'Math & Statistics',
      prompt: 'How do I calculate standard deviation step-by-step with a simple example?',
    },
    {
      icon: BookOpen,
      title: 'Science & Biology',
      prompt: 'Explain Cellular Respiration vs Photosynthesis in simple English.',
    },
    {
      icon: PenTool,
      title: 'Essay & Writing',
      prompt: 'Help me outline a 5-paragraph argumentative essay on AI ethics in healthcare.',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          simpleLanguage: settings.simpleLanguage,
          history: chatHistory.slice(-6),
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I answered your question above. Let me know if you need further clarification!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat API Error', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "I experienced a brief connection glitch, but here is a simple breakdown: Make sure to break down your main topic into 3 core key points and test yourself after reading each section!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ''));
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all chat messages?')) {
      setChatHistory([
        {
          id: 'welcome-reset',
          sender: 'ai',
          text: "Chat cleared! Ask me a new question on any subject.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              AI Study Assistant
            </h1>
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> Live AI Tutor
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Ask any university question. Answers are explained in simple, clear English.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Simple Language Toggle */}
          <button
            id="assistant-simple-mode-toggle"
            onClick={() => setSettings({ ...settings, simpleLanguage: !settings.simpleLanguage })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
              settings.simpleLanguage
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Simple English vs Academic Tone"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.simpleLanguage ? 'Mode: Simple English (ELI5)' : 'Mode: Academic'}</span>
          </button>

          {/* Clear Chat */}
          <button
            id="assistant-clear-chat-btn"
            onClick={handleClearHistory}
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Banner if chat is short */}
      {chatHistory.length <= 2 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Popular Study Prompts (Click to Ask):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {promptSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  id={`prompt-suggestion-${idx}`}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm text-left transition-all flex items-start space-x-3 group"
                >
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      "{item.prompt}"
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl border border-blue-100 dark:border-slate-800 p-4 sm:p-6 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4 shadow-inner">
        {chatHistory.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isAi ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isAi
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 shadow-xs'
                      : 'bg-blue-600 text-white rounded-br-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${isAi ? 'justify-start' : 'justify-end'}`}>
                  <span>{msg.timestamp}</span>

                  {isAi && (
                    <div className="flex items-center space-x-1 pl-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Copy to clipboard"
                        id={`copy-btn-${msg.id}`}
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title={speakingId === msg.id ? 'Stop audio' : 'Read response aloud'}
                        id={`speak-btn-${msg.id}`}
                      >
                        {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner Dots */}
        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CampusMate AI is thinking</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question (e.g., 'Explain thermodynamics laws simply', 'How to write a lab report')..."
          className="w-full pl-4 pr-14 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-xs transition-colors"
          id="assistant-chat-input"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="absolute right-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
          id="assistant-send-btn"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
