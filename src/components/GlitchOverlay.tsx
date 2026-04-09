"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface GlitchOverlayProps {
  show: boolean;
  level: number;
  onDismiss: () => void;
}

export default function GlitchOverlay({ show, level, onDismiss }: GlitchOverlayProps) {
  useEffect(() => {
    if (show) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#3b82f6", "#10b981", "#f43f5e", "#a855f7", "#eab308"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#3b82f6", "#10b981", "#f43f5e", "#a855f7", "#eab308"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Big burst
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#3b82f6", "#10b981", "#f43f5e", "#a855f7", "#eab308"],
      });
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 185, 129, 0.1) 2px, rgba(16, 185, 129, 0.1) 4px)",
            }}
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative z-10 text-center px-8 py-12"
          >
            {/* Glitch title */}
            <motion.div
              animate={{
                x: [0, -3, 3, -2, 0],
                y: [0, 2, -2, 1, 0],
              }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              <h1
                className="text-6xl md:text-8xl font-black text-emerald-400 text-glow-emerald glitch-text mb-4"
                data-text="HACKED!"
              >
                HACKED!
              </h1>
            </motion.div>

            {/* Level cleared */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <p className="text-2xl font-bold text-white">
                Level {level} Cleared! 🎉
              </p>
              <p className="text-sm text-slate-400">
                {level === 1 && "You successfully extracted the secret key using direct injection."}
                {level === 2 && "You overrode the AI's strict scoring rules with indirect injection."}
                {level === 3 && "You hijacked an internal tool command — advanced injection mastered!"}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-slate-500 mt-6"
              >
                Click anywhere to continue
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
