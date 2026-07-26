import React, { useState } from 'react';
import { StudySchedule, TaskItem } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Download, 
  Share2, 
  Sparkles, 
  BookOpen, 
  Tag, 
  RefreshCw,
  Trash2,
  ListTodo
} from 'lucide-react';

interface PlannerPageProps {
  savedPlans: StudySchedule[];
  setSavedPlans: React.Dispatch<React.SetStateAction<StudySchedule[]>>;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({
  savedPlans,
  setSavedPlans,
}) => {
  // Form State
  const [subject, setSubject] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [totalHours, setTotalHours] = useState(8);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<StudySchedule | null>(savedPlans[0] || null);

  const categoryColors: Record<string, string> = {
    reading: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200',
    practice: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200',
    writing: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
    review: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
    break: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
  };

  const handleGenerateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !assignmentTitle.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          assignmentTitle,
          deadline,
          hoursPerDay,
          totalHours,
          difficulty,
        }),
      });

      const newPlan: StudySchedule = await res.json();
      setActivePlan(newPlan);
      setSavedPlans((prev) => [newPlan, ...prev]);
    } catch (err) {
      console.error('Planner Error', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    if (!activePlan) return;

    const updatedDays = activePlan.days.map((day, idx) => {
      if (idx !== dayIndex) return day;
      return {
        ...day,
        tasks: day.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    });

    const updatedPlan = { ...activePlan, days: updatedDays };
    setActivePlan(updatedPlan);

    setSavedPlans((prev) =>
      prev.map((p) => (p.id === activePlan.id ? updatedPlan : p))
    );
  };

  const calculateProgress = () => {
    if (!activePlan) return 0;
    let totalTasks = 0;
    let completedTasks = 0;
    activePlan.days.forEach((day) => {
      day.tasks.forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Delete this saved study plan?')) {
      const remaining = savedPlans.filter((p) => p.id !== id);
      setSavedPlans(remaining);
      if (activePlan?.id === id) {
        setActivePlan(remaining[0] || null);
      }
    }
  };

  const handleExportPlan = () => {
    if (!activePlan) return;
    let textContent = `========================================\nCAMPUSMATE AI STUDY SCHEDULE\nSubject: ${activePlan.subject}\nAssignment: ${activePlan.assignmentTitle}\nDeadline: ${activePlan.deadline}\n========================================\n\n`;

    activePlan.days.forEach((day) => {
      textContent += `--- ${day.dateStr} (${day.focusTitle}) ---\n`;
      day.tasks.forEach((t) => {
        textContent += ` [${t.completed ? 'X' : ' '}] ${t.title} (${t.estimatedMinutes} mins) - Category: ${t.category}\n`;
      });
      textContent += '\n';
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePlan.subject.replace(/\s+/g, '_')}_Study_Schedule.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-blue-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Assignment & Exam Planner
          </h1>
          <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" /> AI Schedule Generator
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          Input your course name, deadline, and available hours to generate a structured day-by-day study schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Plan New Assignment
          </h3>

          <form onSubmit={handleGenerateSchedule} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Subject / Course Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Computer Science 101, Organic Chemistry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="planner-subject-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Assignment or Exam Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Final Research Paper, Midterm Exam Prep"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="planner-title-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Deadline Date
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="planner-deadline-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="planner-difficulty-select"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard / Heavy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Daily Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="planner-hours-per-day-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Total Hours Target
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={totalHours}
                  onChange={(e) => setTotalHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="planner-total-hours-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
              id="planner-generate-btn"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Study Schedule...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Generate Study Schedule</span>
                </>
              )}
            </button>
          </form>

          {/* Saved Plans Selector List */}
          {savedPlans.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Saved Study Plans ({savedPlans.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      activePlan?.id === plan.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                    onClick={() => setActivePlan(plan)}
                    id={`saved-plan-item-${plan.id}`}
                  >
                    <div>
                      <div className="font-bold truncate max-w-[180px]">{plan.subject}: {plan.assignmentTitle}</div>
                      <div className="text-[10px] text-slate-500">Deadline: {plan.deadline}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(plan.id);
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Schedule Display View (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-6">
          {activePlan ? (
            <>
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                      {activePlan.subject}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Due: {activePlan.deadline}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {activePlan.assignmentTitle}
                  </h2>
                </div>

                <button
                  onClick={handleExportPlan}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold transition-colors"
                  id="planner-export-btn"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export (.TXT)</span>
                </button>
              </div>

              {/* Strategy & Progress */}
              <div className="bg-blue-50/70 dark:bg-slate-900/60 p-4 rounded-xl border border-blue-100 dark:border-slate-700 space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{activePlan.overview}"
                </p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Overall Completion Progress</span>
                    <span>{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Day-by-day Breakdown */}
              <div className="space-y-4">
                {activePlan.days.map((day, dayIdx) => (
                  <div
                    key={day.dayNumber}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {day.dayNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {day.dateStr}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {day.dailyHours} hrs
                      </span>
                    </div>

                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Focus: {day.focusTitle}
                    </p>

                    <div className="space-y-2">
                      {day.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTaskCompletion(dayIdx, task.id)}
                          className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            task.completed
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-slate-500 line-through'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-300'
                          }`}
                          id={`task-item-${task.id}`}
                        >
                          <div className="flex items-center space-x-2.5">
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="font-medium">{task.title}</span>
                          </div>

                          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${categoryColors[task.category] || categoryColors.practice}`}>
                              {task.category}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {task.estimatedMinutes}m
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <ListTodo className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Active Study Schedule Selected
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Fill out the assignment form on the left to generate your custom AI-powered daily study plan!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
