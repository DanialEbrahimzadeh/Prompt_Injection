"use client";

import { motion } from "framer-motion";

interface LevelSelectorProps {
  currentLevel: number;
  completedLevels: number[];
  onSelectLevel: (level: number) => void;
}

const LEVELS = [
  { id: 1, name: "The Secret Leak", icon: "🔓", subtitle: "Direct Injection" },
  { id: 2, name: "The Rating Override", icon: "📊", subtitle: "Indirect Injection" },
  { id: 3, name: "The Tool Hijack", icon: "⚙️", subtitle: "Advanced Injection" },
];

export default function LevelSelector({ currentLevel, completedLevels, onSelectLevel }: LevelSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {LEVELS.map((level) => {
        const isActive = currentLevel === level.id;
        const isCompleted = completedLevels.includes(level.id);

        return (
          <motion.button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative text-left px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer
              ${isActive
                ? "border-blue-500/60 bg-blue-500/10 border-glow-blue"
                : isCompleted
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{level.icon}</span>
                <div>
                  <div className={`text-sm font-semibold ${isActive ? "text-blue-400" : isCompleted ? "text-emerald-400" : "text-slate-200"}`}>
                    Level {level.id}
                  </div>
                  <div className={`text-xs ${isActive ? "text-blue-300/70" : "text-slate-400"}`}>
                    {level.subtitle}
                  </div>
                </div>
              </div>
              {isCompleted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-400 text-lg"
                >
                  ✓
                </motion.span>
              )}
            </div>
            <div className={`mt-1 text-xs font-medium ${isActive ? "text-blue-300/80" : "text-slate-500"}`}>
              {level.name}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
