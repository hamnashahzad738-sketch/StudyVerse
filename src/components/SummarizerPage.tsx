import React, { useState } from 'react';
import { NotesSummary, Flashcard } from '../types';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  RotateCw, 
  Download,
  ListCheck
} from 'lucide-react';

interface SummarizerPageProps {
  savedSummaries: NotesSummary[];
  setSavedSummaries: React.Dispatch<React.SetStateAction<NotesSummary[]>>;
}

export const SummarizerPage: React.FC<SummarizerPageProps> = ({
  savedSummaries,
  setSavedSummaries,
}) => {
  const [notesText, setNotesText] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [activeSummary, setActiveSummary] = useState<NotesSummary | null>(savedSummaries[0] || null);
  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const sampleNotes = [
    {
      label: 'Intro to Neural Networks',
      title: 'Neural Networks & Deep Learning',
      text: `Artificial Neural Networks (ANNs) are computing systems inspired by the biological neural networks in animal brains. An ANN is based on a collection of connected units or nodes called artificial neurons. Each connection can transmit a signal to other neurons. An artificial neuron receives signals, processes them, and can signal neurons connected to it. The "signal" at a connection is a real number, and the output of each neuron is computed by some non-linear function of the sum of its inputs. The connections are called edges. Neurons and edges typically have a weight that adjusts as learning proceeds. The weight increases or decreases the strength of the signal at a connection. Neurons may have a threshold such that a signal is sent only if the aggregate signal crosses that threshold. Typically, neurons are aggregated into layers. Different layers may perform different transformations on their inputs. Signals travel from the first layer (the input layer), to the last layer (the output layer), possibly after traversing the layers multiple times (hidden layers).`,
    },
    {
      label: 'Principles of Economics',
      title: 'Supply, Demand, and Market Equilibrium',
      text: `The law of supply and demand is a fundamental economic theory that explains how supply and demand are related to each other and how that relationship affects the price of goods and services. Supply is the amount of a good or service available to consumers. Demand is the desire of consumers to purchase goods and services. When supply exceeds demand, prices tend to fall. When demand exceeds supply, prices tend to rise. Market equilibrium occurs when the quantity demanded equals the quantity supplied at a specific price point. External factors such as government subsidies, inflation, consumer preferences, and production costs can shift the supply or demand curves, creating a new equilibrium price.`,
    },
    {
      label: 'Cell Biology: DNA Replication',
      title: 'DNA Structure & Replication Mechanism',
      text: `DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule. DNA consists of a double helix of two complementary strands. During replication, these strands are separated by the enzyme Helicase. Each strand of the original DNA molecule then serves as a template for the production of its counterpart, a process referred to as semiconservative replication. Cellular proofreading and error-checking mechanisms ensure near-perfect fidelity for DNA replication. DNA Polymerase synthesizes new DNA strands by adding nucleotides complementary to the template in a 5' to 3' direction.`,
    },
  ];

  const handleSummarize = async (customText?: string, customTitle?: string) => {
    const textToProcess = customText || notesText;
    const titleToProcess = customTitle || title || 'Lecture Summary';

    if (!textToProcess || textToProcess.trim().length < 15) return;

    setLoading(true);

    try {
      const res = await fetch('/api/notes/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess, title: titleToProcess }),
      });

      const newSummary: NotesSummary = await res.json();
      setActiveSummary(newSummary);
      setSavedSummaries((prev) => [newSummary, ...prev]);
      setActiveFlashcardIdx(0);
      setIsFlipped(false);
    } catch (err) {
      console.error('Summarizer Error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!activeSummary) return;
    const textToCopy = `TITLE: ${activeSummary.title}\n\nEXECUTIVE SUMMARY:\n${activeSummary.executiveSummary}\n\nKEY TAKEAWAYS:\n${activeSummary.keyTakeaways.map((k) => `• ${k}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-blue-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Notes Summarizer
          </h1>
          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" /> Key Takeaways + Flashcards
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
          Paste textbook chapters or lecture notes to extract simple English key points, glossary terms, and interactive flashcards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Paste Lecture Notes
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Note Title / Topic
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 4: Neural Networks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="summarizer-title-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Raw Lecture Text / Transcript
            </label>
            <textarea
              rows={8}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Paste raw text here..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
              id="summarizer-text-input"
            />
          </div>

          {/* Sample Notes Pre-fill Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sample Notes:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleNotes.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNotesText(sample.text);
                    setTitle(sample.title);
                    handleSummarize(sample.text, sample.title);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-medium transition-colors"
                  id={`sample-notes-btn-${idx}`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleSummarize()}
            disabled={loading || !notesText.trim()}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            id="summarizer-generate-btn"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Summarizing Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Summarize & Create Flashcards</span>
              </>
            )}
          </button>
        </div>

        {/* Output Column (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-6">
          {activeSummary ? (
            <>
              {/* Summary Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                    Summary Ready
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {activeSummary.title}
                  </h2>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  id="summarizer-copy-btn"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Executive Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {activeSummary.executiveSummary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {activeSummary.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Revision Flashcards */}
              {activeSummary.flashcards && activeSummary.flashcards.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> Interactive Revision Flashcard ({activeFlashcardIdx + 1}/{activeSummary.flashcards.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">Click card to flip</span>
                  </div>

                  {/* Flashcard Box */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white min-h-[160px] flex flex-col justify-between cursor-pointer shadow-md transform transition-all duration-300 hover:scale-[1.01]"
                    id={`flashcard-card-${activeFlashcardIdx}`}
                  >
                    <div className="text-xs uppercase font-mono tracking-wider opacity-80 flex items-center justify-between">
                      <span>{isFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}</span>
                      <RotateCw className="w-4 h-4 opacity-70" />
                    </div>

                    <div className="text-base sm:text-lg font-bold text-center my-4 leading-relaxed">
                      {isFlipped
                        ? activeSummary.flashcards[activeFlashcardIdx].answer
                        : activeSummary.flashcards[activeFlashcardIdx].question}
                    </div>

                    <div className="text-[11px] text-center opacity-75 font-medium">
                      Tap card to reveal {isFlipped ? 'question' : 'answer'}
                    </div>
                  </div>

                  {/* Flashcard Nav */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      disabled={activeFlashcardIdx === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setActiveFlashcardIdx((p) => Math.max(0, p - 1));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold disabled:opacity-40"
                    >
                      Previous Card
                    </button>

                    <button
                      disabled={activeFlashcardIdx === activeSummary.flashcards.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setActiveFlashcardIdx((p) => Math.min(activeSummary.flashcards.length - 1, p + 1));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
                    >
                      Next Card
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Notes Summarized Yet
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Paste your lecture slides on the left or click one of the sample notes to generate instant summaries and flashcards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
