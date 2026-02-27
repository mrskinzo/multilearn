"use client";

import { useState } from "react";
import { Explanations } from "@/lib/types";

interface ExplanationViewerProps {
  explanations: Explanations;
}

const MODES = [
  {
    key: "simple" as const,
    label: "Simple",
    icon: "🧒",
    tagline: "Like you're 10",
    color: "text-yellow-400",
    activeBg: "bg-yellow-500/20 border-yellow-500/40",
  },
  {
    key: "analogy" as const,
    label: "Analogy",
    icon: "🎭",
    tagline: "Through metaphor",
    color: "text-blue-400",
    activeBg: "bg-blue-500/20 border-blue-500/40",
  },
  {
    key: "technical" as const,
    label: "Technical",
    icon: "🔬",
    tagline: "Full depth",
    color: "text-green-400",
    activeBg: "bg-green-500/20 border-green-500/40",
  },
];

export default function ExplanationViewer({ explanations }: ExplanationViewerProps) {
  const [activeMode, setActiveMode] = useState<"simple" | "analogy" | "technical">("simple");

  const current = MODES.find((m) => m.key === activeMode)!;

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-3">
        {MODES.map((mode) => {
          const isActive = mode.key === activeMode;
          return (
            <button
              key={mode.key}
              onClick={() => setActiveMode(mode.key)}
              className={`p-4 rounded-xl border text-center transition-all ${
                isActive
                  ? mode.activeBg
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-2xl mb-1">{mode.icon}</div>
              <div
                className={`font-semibold text-sm ${isActive ? mode.color : "text-white"}`}
              >
                {mode.label}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">{mode.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className={`rounded-2xl border p-6 transition-all ${current.activeBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{current.icon}</span>
          <span className={`font-semibold ${current.color}`}>{current.label} Explanation</span>
          <span className="text-slate-500 text-sm">— {current.tagline}</span>
        </div>
        <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
          {explanations[activeMode]}
        </div>
      </div>

      {/* Tip */}
      <div className="text-center text-slate-600 text-sm">
        Switch between modes to see the same concept from 3 different angles
      </div>
    </div>
  );
}
