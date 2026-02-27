"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { icon: "🔍", label: "Analyzing content" },
  { icon: "✍️", label: "Writing summary" },
  { icon: "🗺", label: "Building mind map" },
  { icon: "🃏", label: "Creating flashcards" },
  { icon: "🧪", label: "Writing quiz" },
  { icon: "💡", label: "Crafting explanations" },
];

export default function LoadingView() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white">Generating your learning kit</h2>
          <p className="text-slate-400 text-sm mt-1">This takes about 10–15 seconds</p>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isCurrent
                    ? "bg-purple-600/20 border border-purple-500/30"
                    : isDone
                    ? "opacity-60"
                    : "opacity-25"
                }`}
              >
                <span className="text-xl">{step.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    isCurrent ? "text-white" : isDone ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
                {isDone && (
                  <span className="ml-auto text-green-400 text-sm">✓</span>
                )}
                {isCurrent && (
                  <span className="ml-auto">
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${dot * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
