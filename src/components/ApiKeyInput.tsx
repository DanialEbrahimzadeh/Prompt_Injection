"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(!apiKey);

  if (!isEditing && apiKey) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400">🔑 API Key Set</span>
            <span className="text-xs text-slate-500 font-mono">
              {apiKey.substring(0, 6)}...{apiKey.substring(apiKey.length - 4)}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30 border-glow-blue"
    >
      <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
        🔑 Google Gemini API Key
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Paste your API key here..."
            className="w-full bg-slate-900/80 text-slate-200 text-sm font-mono rounded-md px-3 py-2 border border-slate-700/60 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
        {apiKey && (
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer"
          >
            Save
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Your key stays in your browser only — it&apos;s sent directly to Google&apos;s API.
      </p>
    </motion.div>
  );
}
