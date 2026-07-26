import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  MessageSquare, 
  Calendar, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  Clock, 
  Award,
  Zap,
  Users,
  ChevronDown,
  Mail,
  Send,
  ShieldCheck,
  Star,
  Check,
  MessageCircle,
  Laptop
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: PageTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const features = [
    {
      id: 'assistant' as PageTab,
      title: 'AI Study Assistant',
      description: 'Get instant, simple English answers to complex university questions across Math, CS, Biology, Business, and Humanities.',
      icon: MessageSquare,
      color: 'bg-blue-600',
      tag: 'Interactive AI Chat',
      highlight: 'Step-by-step logic & code support'
    },
    {
      id: 'planner' as PageTab,
      title: 'Assignment Planner',
      description: 'Convert syllabus deadlines and exam dates into a custom day-by-day study schedule with recommended daily hours.',
      icon: Calendar,
      color: 'bg-indigo-600',
      tag: 'Smart Scheduler',
      highlight: 'Automated Pomodoro breakdowns'
    },
    {
      id: 'quiz' as PageTab,
      title: 'Quiz Generator',
      description: 'Generate instant 5-question multiple choice practice quizzes for any topic with detailed explanations for correct answers.',
      icon: HelpCircle,
      color: 'bg-sky-600',
      tag: '5 MCQs + Feedback',
      highlight: 'Instant self-testing scorecards'
    },
    {
      id: 'summarizer' as PageTab,
      title: 'Notes Summarizer',
      description: 'Paste lengthy lecture notes or textbook chapters to extract key takeaways, executive summaries, and interactive flashcards.',
      icon: FileText,
      color: 'bg-blue-700',
      tag: 'Key Takeaways & Flashcards',
      highlight: 'Turn 10 pages into 1-min revision'
    },
  ];

  const whyChooseUs = [
    {
      icon: Sparkles,
      title: 'Simple English Explanations',
      description: 'Complex formulas and dense academic jargon are translated into clear, step-by-step concepts that anyone can grasp effortlessly.'
    },
    {
      icon: Clock,
      title: 'Balanced Study Plans',
      description: 'Stop midnight cramming. Our planner calculates realistic daily study hours aligned directly with your assignment deadlines.'
    },
    {
      icon: Award,
      title: 'Active Recall & MCQs',
      description: 'Scientific studies prove self-testing boosts retention by 40%. Practice with 5 targeted MCQs before walking into exam rooms.'
    },
    {
      icon: ShieldCheck,
      title: 'Private & Local Storage',
      description: 'Your study notes, chat history, and generated schedules remain safely saved in your browser with zero subscription locks.'
    }
  ];

  const testimonials = [
    {
      quote: "StudyVerse helped me break down organic chemistry into simple step-by-step steps. The Quiz Generator is a lifesaver before midterms!",
      author: "Sarah M.",
      major: "Pre-Med Student, Year 3",
      grade: "A- in Biochemistry",
      rating: 5
    },
    {
      quote: "The Assignment Planner generated a realistic 5-day study plan for my Computer Science final. I went into the exam feeling completely ready.",
      author: "David K.",
      major: "Computer Science Major",
      grade: "3.9 GPA",
      rating: 5
    },
    {
      quote: "I paste 20 pages of lecture transcripts into the Notes Summarizer and get instant flashcards. It cuts my revision time in half!",
      author: "Elena R.",
      major: "Business & Finance",
      grade: "Dean's List",
      rating: 5
    }
  ];

  const faqs = [
    {
      q: "How does StudyVerse make complex topics easier to understand?",
      a: "StudyVerse uses specialized AI models designed to translate dense academic language into simple English (ELI5). It breaks concepts down into step-by-step logic, practical analogies, and clear key points."
    },
    {
      q: "Is StudyVerse free for university students?",
      a: "Yes! StudyVerse provides free access to all core study tools, including the AI Study Assistant, Assignment Planner, Quiz Generator, and Notes Summarizer."
    },
    {
      q: "Can I use StudyVerse for technical subjects like Coding or Math?",
      a: "Absolutely. You can paste Python/Java code, calculus equations, or biology transcripts, and StudyVerse will format solutions in clear code blocks and structured math formulas."
    },
    {
      q: "Is my study data and chat history saved?",
      a: "Yes! Your generated study plans, quiz scores, and chat logs are saved directly in your browser's local storage so you can return anytime during your semester."
    },
    {
      q: "How does the Quiz Generator work?",
      a: "Simply enter any topic (e.g., 'Data Structures', 'Microeconomics') and click generate. StudyVerse produces 5 multiple choice questions with immediate feedback and detailed explanations for every option."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-20 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-blue-50/90 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-b border-blue-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Next-Gen AI Platform for University Students</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Study Smarter, Not Harder with <span className="text-blue-600 dark:text-blue-400">StudyVerse</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Your 24/7 university study assistant. Ask questions in simple English, generate custom study schedules, test yourself with 5-question quizzes, and summarize lecture notes in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="hero-get-started-btn"
                onClick={() => setActiveTab('assistant')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] focus:outline-none"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-explore-planner-btn"
                onClick={() => setActiveTab('planner')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-base border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Plan an Assignment</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Simple English Explanations</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Quiz Feedback</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-blue-100 dark:border-slate-700/80 shadow-sm">
            <div className="text-center p-3 border-r border-slate-100 dark:border-slate-700/60 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">50,000+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Questions Answered</div>
            </div>
            <div className="text-center p-3 border-r border-slate-100 dark:border-slate-700/60 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">98%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Student Satisfaction</div>
            </div>
            <div className="text-center p-3 border-r border-slate-100 dark:border-slate-700/60 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">10 hrs/wk</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Average Time Saved</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">4.9 / 5.0</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Study Efficiency Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Choose CampusMate AI Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Built for Academic Excellence
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Why Choose StudyVerse?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base">
            Engineered specifically to solve the biggest study friction points faced by university students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Complete AI Study Suite
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Four Essential Tools in One Single App
          </h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base">
            Master your coursework, organize your deadlines, and ace your exams with AI precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-blue-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-600">
                      {feature.tag}
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h4>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {feature.highlight}
                  </span>

                  <button
                    id={`feature-btn-${feature.id}`}
                    onClick={() => setActiveTab(feature.id)}
                    className="inline-flex items-center space-x-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="bg-blue-50/50 dark:bg-slate-800/40 py-16 border-y border-blue-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
              <span>Student Success Stories</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Loved by University Students Nationwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{t.author}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.major}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {t.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Everything you need to know about using CampusMate AI for your university studies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700/80 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base focus:outline-none"
                  id={`faq-toggle-${idx}`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
              Get In Touch
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Have Feedback or Questions?
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Our team is continuously improving StudyVerse for university students. Drop us a note anytime!
            </p>
            <div className="space-y-2 text-xs text-blue-100 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300" />
                <span>support@studyverse.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-300" />
                <span>Student Success Helpdesk</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl text-slate-900 dark:text-white shadow-lg space-y-4">
            {contactSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold">Message Sent!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thank you for reaching out. We will get back to your student email shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Alex Smith"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="contact-name-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="contact-email-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Message / Feedback
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us what tool or feature you'd love to see next..."
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    id="contact-message-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  id="contact-submit-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
