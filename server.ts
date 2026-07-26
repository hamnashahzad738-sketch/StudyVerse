import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    app: "StudyVerse Server",
    aiEnabled: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Study Assistant Chat
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, simpleLanguage = true, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required" });
    }

    const ai = getGeminiClient();

    if (ai) {
      const toneInstruction = simpleLanguage
        ? "Explain concepts in very clear, simple English without unnecessary jargon. Use analogies, bullet points, and step-by-step breakdowns where helpful so a university student can understand effortlessly."
        : "Provide clear, rigorous university-level academic explanations with structured bullet points and practical examples.";

      const systemInstruction = `You are StudyVerse, a friendly, highly intelligent university study assistant. Your goal is to help students learn faster and understand concepts deeply. ${toneInstruction} Always format key terms in **bold** and code or formulas in code blocks if relevant.`;

      // Build chat contents from history
      const formattedHistory = Array.isArray(history)
        ? history.slice(-6).map((h: { sender: string; text: string }) => ({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          }))
        : [];

      const contents = [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents as any,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I'm sorry, I couldn't generate an answer at this moment.";
      return res.json({ reply: replyText, source: "gemini" });
    }

    // Fallback generator if API key is not present
    const fallbackReply = generateFallbackChatResponse(message, simpleLanguage);
    return res.json({ reply: fallbackReply, source: "fallback" });
  } catch (error: any) {
    console.error("Chat error:", error);
    const fallbackReply = generateFallbackChatResponse(req.body.message || "study tips", req.body.simpleLanguage);
    return res.json({
      reply: fallbackReply,
      source: "fallback",
      note: "Using offline intelligent study engine due to key connectivity.",
    });
  }
});

// 3. Assignment Planner Generator
app.post("/api/planner/generate", async (req, res) => {
  try {
    const { subject, assignmentTitle, deadline, hoursPerDay = 2, totalHours = 8, difficulty = "Medium" } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Create a detailed day-by-day study schedule for a university student.
Subject: ${subject}
Assignment/Exam: ${assignmentTitle}
Deadline Date: ${deadline}
Available Hours Per Day: ${hoursPerDay} hours
Target Total Study Hours: ${totalHours} hours
Difficulty Level: ${difficulty}

Return a structured JSON study schedule breaking down the work across 3 to 7 days up to the deadline.
Each day must have a clear focus title, daily hours, and 2 to 4 actionable tasks with estimated minutes and category tags ('reading', 'practice', 'writing', 'review', 'break').`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING, description: "A encouraging 2-sentence summary of the strategy" },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    dateStr: { type: Type.STRING, description: "Day label like 'Day 1: Foundation & Reading'" },
                    focusTitle: { type: Type.STRING },
                    dailyHours: { type: Type.NUMBER },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          estimatedMinutes: { type: Type.INTEGER },
                          category: { type: Type.STRING, description: "one of: reading, practice, writing, review, break" }
                        },
                        required: ["id", "title", "estimatedMinutes", "category"]
                      }
                    }
                  },
                  required: ["dayNumber", "dateStr", "focusTitle", "dailyHours", "tasks"]
                }
              }
            },
            required: ["overview", "days"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          id: `plan-${Date.now()}`,
          subject,
          assignmentTitle,
          deadline,
          totalHours: Number(totalHours),
          hoursPerDay: Number(hoursPerDay),
          difficulty,
          overview: parsed.overview || "Custom schedule tailored to your deadline and study goals.",
          days: parsed.days || [],
          createdAt: new Date().toLocaleDateString()
        });
      }
    }

    // Fallback schedule generator
    const fallbackPlan = generateFallbackStudyPlan(subject, assignmentTitle, deadline, hoursPerDay, totalHours, difficulty);
    return res.json(fallbackPlan);
  } catch (error) {
    console.error("Planner error:", error);
    const fallbackPlan = generateFallbackStudyPlan(
      req.body.subject || "General Study",
      req.body.assignmentTitle || "Preparation",
      req.body.deadline || "Next Week",
      req.body.hoursPerDay || 2,
      req.body.totalHours || 8,
      req.body.difficulty || "Medium"
    );
    return res.json(fallbackPlan);
  }
});

// 4. Quiz Generator (5 MCQs)
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { topic, difficulty = "Medium" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Generate a 5-question multiple choice quiz on the topic "${topic}" for a university level student at ${difficulty} difficulty.
Each question must have 4 options, a 0-indexed correct option (0, 1, 2, or 3), and a clear, simple English explanation explaining why the correct choice is right and others are wrong.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctAnswerIndex: { type: Type.INTEGER, description: "Index between 0 and 3" },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          id: `quiz-${Date.now()}`,
          topic,
          difficulty,
          questions: parsed.questions,
          createdAt: new Date().toLocaleDateString()
        });
      }
    }

    // Fallback quiz generator
    const fallbackQuiz = generateFallbackQuiz(topic, difficulty);
    return res.json(fallbackQuiz);
  } catch (error) {
    console.error("Quiz error:", error);
    const fallbackQuiz = generateFallbackQuiz(req.body.topic || "General Science", req.body.difficulty || "Medium");
    return res.json(fallbackQuiz);
  }
});

// 5. Notes Summarizer
app.post("/api/notes/summarize", async (req, res) => {
  try {
    const { text, title = "Lecture Notes" } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: "Please enter at least a few sentences of notes to summarize." });
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Summarize the following university lecture/textbook notes concisely in simple English.
Title/Subject: ${title}
Notes Content:
"""
${text}
"""

Provide:
1. Executive Summary (2-3 simple sentences)
2. 4-6 Key Takeaways (bullet points)
3. 3-5 Glossary terms with simple definitions
4. 3-5 Revision Flashcards (question & answer pairs)
5. 2-4 Actionable Study Checklist items`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              terms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    definition: { type: Type.STRING }
                  },
                  required: ["term", "definition"]
                }
              },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ["question", "answer"]
                }
              },
              actionItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["executiveSummary", "keyTakeaways", "terms", "flashcards", "actionItems"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          id: `summary-${Date.now()}`,
          title,
          executiveSummary: parsed.executiveSummary,
          keyTakeaways: parsed.keyTakeaways,
          terms: parsed.terms,
          flashcards: parsed.flashcards.map((f: any, idx: number) => ({ id: `card-${idx}`, ...f })),
          actionItems: parsed.actionItems,
          createdAt: new Date().toLocaleDateString()
        });
      }
    }

    // Fallback notes summarizer
    const fallbackSummary = generateFallbackSummary(text, title);
    return res.json(fallbackSummary);
  } catch (error) {
    console.error("Summarizer error:", error);
    const fallbackSummary = generateFallbackSummary(req.body.text || "", req.body.title || "Lecture Notes");
    return res.json(fallbackSummary);
  }
});

// Helper Fallback functions
function generateFallbackChatResponse(query: string, simpleLanguage: boolean): string {
  const q = query.toLowerCase();
  if (q.includes("python") || q.includes("code") || q.includes("programming")) {
    return `Here is a simple explanation of programming logic:

- **Key Concept**: Code is a step-by-step set of instructions given to a computer.
- **Variables**: Think of variables as labeled boxes holding values (e.g., \`score = 95\`).
- **Functions**: Think of functions as reusable recipes that take ingredients (inputs) and return a completed dish (output).

\`\`\`python
# Simple example
def greet_student(name):
    return f"Welcome to StudyVerse, {name}!"

print(greet_student("Alex"))
\`\`\`

**Study Tip**: Practice writing 10 lines of code every day rather than cramming 100 lines once a week!`;
  } else if (q.includes("math") || q.includes("calculus") || q.includes("formula")) {
    return `Here is a simple guide to solving math problems step-by-step:

1. **Identify the Given Information**: Write down what values you know.
2. **Determine What You Need**: Highlight the target variable or question.
3. **Choose the Right Formula**: Match the variables to a standard equation.
4. **Check Your Work**: Estimate if the answer makes logical sense.

**Pro-Tip**: Don't memorize formulas blindly — understand *why* the formula works visually or conceptually!`;
  } else {
    return `That's a great study question! Here is a simple, structured breakdown to help you master this concept:

1. **Core Idea**: Focus on the main principle first before diving into small details.
2. **Real-World Analogy**: Relate this topic to something you experience every day.
3. **Active Recall**: Try explaining this back to a peer in your own words without looking at your notes.

*Feel free to ask follow-up questions or paste specific textbook passages if you'd like a deeper breakdown!*`;
  }
}

function generateFallbackStudyPlan(subject: string, assignment: string, deadline: string, hpd: number, totalH: number, diff: string) {
  return {
    id: `plan-${Date.now()}`,
    subject,
    assignmentTitle: assignment,
    deadline,
    totalHours: Number(totalH),
    hoursPerDay: Number(hpd),
    difficulty: diff as any,
    overview: `Structured ${totalH}-hour study blueprint broken into manageable daily sessions leading up to ${deadline}.`,
    days: [
      {
        dayNumber: 1,
        dateStr: "Day 1: Foundation & Reading",
        focusTitle: "Core Concepts & Syllabus Mapping",
        dailyHours: Number(hpd),
        tasks: [
          { id: "t1-1", title: `Review lecture slides & outline key concepts for ${subject}`, estimatedMinutes: 45, category: "reading", completed: false },
          { id: "t1-2", title: `Gather required formulas and reference materials for ${assignment}`, estimatedMinutes: 30, category: "reading", completed: false },
          { id: "t1-3", title: "Pomodoro break & quick recap notes", estimatedMinutes: 15, category: "break", completed: false }
        ]
      },
      {
        dayNumber: 2,
        dateStr: "Day 2: Deep Work & Practice",
        focusTitle: "Problem Solving & Drafting",
        dailyHours: Number(hpd),
        tasks: [
          { id: "t2-1", title: `Work through core practice problems / section drafts`, estimatedMinutes: 60, category: "practice", completed: false },
          { id: "t2-2", title: "Self-quiz on key terminology", estimatedMinutes: 30, category: "practice", completed: false }
        ]
      },
      {
        dayNumber: 3,
        dateStr: "Day 3: Review & Final Polish",
        focusTitle: "Self-Testing & Proofreading",
        dailyHours: Number(hpd),
        tasks: [
          { id: "t3-1", title: "Review weak areas and refine solutions", estimatedMinutes: 45, category: "review", completed: false },
          { id: "t3-2", title: "Final checklist check and submission formatting", estimatedMinutes: 35, category: "writing", completed: false }
        ]
      }
    ],
    createdAt: new Date().toLocaleDateString()
  };
}

function generateFallbackQuiz(topic: string, diff: string) {
  return {
    id: `quiz-${Date.now()}`,
    topic,
    difficulty: diff as any,
    questions: [
      {
        id: 1,
        question: `In the study of ${topic}, what is the primary fundamental principle?`,
        options: [
          "Understanding key underlying concepts and relationships",
          "Memorizing definitions without applying them",
          "Skipping basic principles to read advanced theory",
          "Relying solely on intuition without verification"
        ],
        correctAnswerIndex: 0,
        explanation: "Mastering core foundational concepts provides the framework required to solve complex problems effectively."
      },
      {
        id: 2,
        question: `Which study technique is scientifically proven to boost long-term retention in ${topic}?`,
        options: [
          "Passive re-reading of slides",
          "Active recall and spaced repetition",
          "Cramming 8 hours right before the exam",
          "Highlighting every line in the textbook"
        ],
        correctAnswerIndex: 1,
        explanation: "Active recall forces your brain to retrieve information, strengthening neural pathways for long-term memory."
      },
      {
        id: 3,
        question: `When analyzing a complex problem in ${topic}, what should be done first?`,
        options: [
          "Break the problem down into smaller, solvable sub-components",
          "Guess the final answer immediately",
          "Ignore given constraints and edge cases",
          "Give up if the solution isn't obvious in 10 seconds"
        ],
        correctAnswerIndex: 0,
        explanation: "Decomposition allows you to tackle overwhelming topics systematically one piece at a time."
      },
      {
        id: 4,
        question: `What role do practice quizzes play in mastering ${topic}?`,
        options: [
          "They highlight knowledge gaps before real exams",
          "They are only useful for grading",
          "They decrease retention by causing stress",
          "They replace the need for reading or understanding"
        ],
        correctAnswerIndex: 0,
        explanation: "Self-testing acts as a diagnostic tool that reveals exactly which topics require additional review."
      },
      {
        id: 5,
        question: `How does teaching a concept in ${topic} to a peer improve your own understanding?`,
        options: [
          "It forces you to articulate the concept simply and identify missing logic",
          "It confuses both you and your peer",
          "It takes away time from reading textbooks",
          "It has no impact on comprehension"
        ],
        correctAnswerIndex: 0,
        explanation: "Known as the Feynman Technique, explaining a topic in simple terms reveals hidden gaps in your own grasp."
      }
    ],
    createdAt: new Date().toLocaleDateString()
  };
}

function generateFallbackSummary(text: string, title: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  return {
    id: `summary-${Date.now()}`,
    title: title || "Class Notes",
    executiveSummary: `This lecture note collection (${wordCount} words) covers core concepts regarding ${title}. It emphasizes foundational principles, key operational mechanisms, and practical applications for university coursework.`,
    keyTakeaways: [
      `Primary focus centers on key concepts described in ${title}.`,
      "Systematic approach: break down complex ideas into manageable components.",
      "Active engagement and regular revision enhance concept mastery.",
      "Key formulas and terms form the cornerstone for upcoming assignments and exams."
    ],
    terms: [
      { term: "Core Principle", definition: "The fundamental law or rule governing the subject matter." },
      { term: "Active Recall", definition: "The practice of testing yourself on material without looking at notes." },
      { term: "Synthesis", definition: "Combining multiple ideas into a coherent understanding." }
    ],
    flashcards: [
      { id: "c1", question: `What is the main topic of these notes on ${title}?`, answer: `The notes focus on key principles, methodologies, and applications of ${title}.` },
      { id: "c2", question: "Why is active recall recommended for studying this topic?", answer: "It builds stronger neural connections and highlights knowledge gaps early." },
      { id: "c3", question: "How should complex topics in these notes be approached?", answer: "By breaking them down into step-by-step sub-concepts." }
    ],
    actionItems: [
      `Review key formulas/terms listed in ${title} summary`,
      "Practice self-testing using the generated flashcards",
      "Formulate 2-3 questions for your next discussion group or professor office hours"
    ],
    createdAt: new Date().toLocaleDateString()
  };
}

// Vite middleware / static serve setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎓 CampusMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
