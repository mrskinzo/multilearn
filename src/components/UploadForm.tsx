"use client";

import { useState } from "react";

interface UploadFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const PLACEHOLDER = `Paste your notes, a textbook excerpt, or any educational content here...

Example: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen. This occurs in the chloroplasts, specifically using chlorophyll to absorb light energy..."`;

export default function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 20) {
      onSubmit(text.trim());
    }
  };

  const charCount = text.length;
  const isReady = charCount >= 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🧠</span>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Multilearn
            </h1>
          </div>
          <p className="text-purple-300 text-lg">
            Turn any material into multi-sensory learning
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
            <span>🎧 Audio</span>
            <span>🗺 Mind Map</span>
            <span>🃏 Flashcards</span>
            <span>🧪 Quiz</span>
            <span>💡 Explanations</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              disabled={isLoading}
              rows={12}
              className="w-full rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 p-5 text-base resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {charCount} chars {!isReady && charCount > 0 && "(min 20)"}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isReady || isLoading}
            className="mt-4 w-full py-4 rounded-2xl font-semibold text-lg transition-all
              bg-purple-600 hover:bg-purple-500 text-white
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {isLoading ? "Generating..." : "Generate Learning Materials →"}
          </button>
        </form>
      </div>
    </div>
  );
}
