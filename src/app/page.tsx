"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LevelSelector from "@/components/LevelSelector";
import ChallengeDescription from "@/components/ChallengeDescription";
import PromptInspector from "@/components/PromptInspector";
import GlitchOverlay from "@/components/GlitchOverlay";
import ApiKeyInput from "@/components/ApiKeyInput";

const STORAGE_KEY = "injection-lab-progress";
const API_KEY_STORAGE = "injection-lab-apikey";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [fullPrompt, setFullPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showGlitch, setShowGlitch] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  // Load progress and API key from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompletedLevels(JSON.parse(saved));
      const savedKey = localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) setApiKey(savedKey);
    } catch { /* ignore */ }
  }, []);

  // Save API key to localStorage
  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
    try { localStorage.setItem(API_KEY_STORAGE, key); } catch { /* ignore */ }
  }, []);

  // Handle level change
  const handleLevelChange = useCallback((level: number) => {
    setCurrentLevel(level);
    setUserInput("");
    setAiResponse("");
    setFullPrompt(null);
    setError("");
    setAttemptCount(0);
  }, []);

  // Submit to API
  const handleSubmit = useCallback(async () => {
    if (!userInput.trim()) return;
    if (!apiKey.trim()) {
      setError("Please enter your Google Gemini API key first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setAiResponse("");
    setAttemptCount((c) => c + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, level: currentLevel, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      setAiResponse(data.response);
      setFullPrompt(data.fullPrompt);

      // Check win
      if (data.won && !completedLevels.includes(currentLevel)) {
        const updated = [...completedLevels, currentLevel];
        setCompletedLevels(updated);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
        // Small delay before showing glitch for dramatic effect
        setTimeout(() => setShowGlitch(true), 500);
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, currentLevel, apiKey, completedLevels]);

  const isLevelCompleted = completedLevels.includes(currentLevel);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Top bar ── */}
      <header className="flex-shrink-0 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-2xl"
            >
              🛡️
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                The Vulnerable Recruiter
              </h1>
              <p className="text-xs text-slate-500">
                AI Prompt Injection Lab — Cybersecurity Workshop
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((l) => (
                <div
                  key={l}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    completedLevels.includes(l)
                      ? "bg-emerald-400 shadow-lg shadow-emerald-400/40"
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {completedLevels.length}/3 cleared
            </span>
          </div>
        </div>
      </header>

      {/* ── Main 3-panel layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left panel: Challenge Info ── */}
        <aside className="w-80 flex-shrink-0 border-r border-slate-800/60 bg-slate-900/30 p-5 overflow-y-auto flex flex-col gap-5">
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Select Challenge
            </h3>
            <LevelSelector
              currentLevel={currentLevel}
              completedLevels={completedLevels}
              onSelectLevel={handleLevelChange}
            />
          </div>

          <div className="border-t border-slate-800/40 pt-4">
            <ChallengeDescription level={currentLevel} />
          </div>
        </aside>

        {/* ── Center panel: HR Dashboard ── */}
        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Level header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-100">
                NeonCorp HR Dashboard
              </h2>
              {isLevelCompleted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30"
                >
                  ✓ Cleared
                </motion.span>
              )}
            </div>
            {attemptCount > 0 && (
              <span className="text-xs text-slate-500 font-mono">
                Attempts: {attemptCount}
              </span>
            )}
          </div>

          {/* Input area */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {currentLevel === 1 && "📄 Your Message to the HR Bot"}
              {currentLevel === 2 && "📄 Submit Your Resume"}
              {currentLevel === 3 && "📄 Your Message to the HR Bot"}
            </label>
            <textarea
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                setFullPrompt(null); // Reset to show live preview
              }}
              placeholder={
                currentLevel === 1
                  ? "Try to trick the AI into revealing its secret key..."
                  : currentLevel === 2
                    ? "Write a resume (or something more creative) to get a perfect 10/10..."
                    : "Try to make the AI execute an action command..."
              }
              rows={6}
              className="w-full bg-slate-900/60 text-slate-200 text-sm font-mono rounded-lg px-4 py-3 border border-slate-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all resize-none placeholder:text-slate-600"
            />
          </div>

          {/* Submit button */}
          <div className="mb-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim()}
              className={`
                w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer
                ${isLoading
                  ? "bg-slate-700 text-slate-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.span>
                  Processing through AI...
                </span>
              ) : (
                "🚀 Submit to RecruiterBot"
              )}
            </motion.button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-3 text-sm text-rose-300"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Response */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {aiResponse && (
                <motion.div
                  key={aiResponse}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-lg p-4 border ${
                    isLevelCompleted
                      ? "bg-emerald-500/5 border-emerald-500/30 border-glow-emerald"
                      : "bg-slate-800/30 border-slate-700/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      🤖 RecruiterBot Response
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── Right panel: Prompt Inspector ── */}
        <aside className="w-96 flex-shrink-0 border-l border-slate-800/60 bg-slate-900/20 p-5 overflow-hidden flex flex-col">
          <PromptInspector
            level={currentLevel}
            userInput={userInput}
            fullPromptFromAPI={fullPrompt}
          />
        </aside>
      </div>

      {/* ── Glitch Overlay ── */}
      <GlitchOverlay
        show={showGlitch}
        level={currentLevel}
        onDismiss={() => setShowGlitch(false)}
      />
    </div>
  );
}
