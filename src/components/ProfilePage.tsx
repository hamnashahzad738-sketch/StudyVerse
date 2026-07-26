import React, { useState } from 'react';
import { UserProfile, ChatMessage, Quiz, NotesSummary, StudySchedule, PageTab } from '../types';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Camera, 
  Check, 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  Save, 
  Trash2,
  Clock,
  ChevronRight,
  Award
} from 'lucide-react';

interface ProfilePageProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  chatHistory: ChatMessage[];
  savedQuizzes: Quiz[];
  savedSummaries: NotesSummary[];
  savedPlans: StudySchedule[];
  setActiveTab: (tab: PageTab) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  setProfile,
  chatHistory,
  savedQuizzes,
  savedSummaries,
  savedPlans,
  setActiveTab,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAvatarSelect = (url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleCustomAvatarApply = () => {
    if (customAvatarUrl.trim()) {
      setFormData((prev) => ({ ...prev, avatarUrl: customAvatarUrl.trim() }));
      setCustomAvatarUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Profile
            </h1>
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Verified Student
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Manage your personal university profile details, avatar, and study storage overview.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 self-start sm:self-auto"
            id="profile-edit-btn"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center space-x-2 animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Profile information updated and saved to Local Storage!</span>
        </div>
      )}

      {/* Main Profile Card & Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Quick Info Card (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-6 flex flex-col items-center text-center">
          <div className="relative group">
            <img
              src={formData.avatarUrl || profile.avatarUrl}
              alt={formData.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-slate-700 shadow-md"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2.5 rounded-full bg-blue-600 text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.name}
            </h2>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span>{profile.major}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.university} • {profile.semester}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{chatHistory.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Chats</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{savedQuizzes.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Quizzes</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400">{savedSummaries.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Summaries</div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form OR Saved Storage Dashboard (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                <User className="w-5 h-5 text-blue-600" /> Edit Student Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="profile-name-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    University / College
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="profile-university-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Major / Field of Study
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="profile-major-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Current Semester / Term
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="profile-semester-input"
                  />
                </div>
              </div>

              {/* Avatar Chooser */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Choose Profile Picture Avatar
                </label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAvatarSelect(url)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                        formData.avatarUrl === url ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      {formData.avatarUrl === url && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white font-bold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Avatar URL input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste image URL (e.g. https://...)"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleCustomAvatarApply}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold hover:bg-slate-300"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                  id="profile-save-btn"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            /* Saved Storage Dashboard */
            <div className="space-y-6">
              {/* Saved Quizzes Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" /> Saved Practice Quizzes ({savedQuizzes.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Quiz Generator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedQuizzes.map((q, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveTab('quiz')}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span className="truncate">{q.topic}</span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px]">
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">5 Questions • Created: {q.createdAt || 'Recent'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    No generated quizzes saved in local storage yet. Visit the Quiz Generator tab to create one!
                  </p>
                )}
              </div>

              {/* Saved Summaries Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" /> Saved Lecture Summaries ({savedSummaries.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('summarizer')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Summarizer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedSummaries.length > 0 ? (
                  <div className="space-y-3">
                    {savedSummaries.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveTab('summarizer')}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer transition-all space-y-1"
                      >
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{s.title}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{s.executiveSummary}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    No summaries saved in local storage yet. Paste lecture notes in the Summarizer tab to save your first one!
                  </p>
                )}
              </div>

              {/* Saved Study Schedules Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" /> Saved Study Plans ({savedPlans.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Assignment Planner</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedPlans.length > 0 ? (
                  <div className="space-y-3">
                    {savedPlans.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveTab('planner')}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{p.assignmentTitle}</div>
                          <div className="text-[11px] text-slate-500">
                            Subject: {p.subject} • Due in {p.daysRemaining} days ({p.dailyHours} hrs/day)
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 font-semibold">{p.dailyBreakdowns.length} steps</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    No assignment study plans saved yet. Generate a plan in the Assignment Planner tab!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
