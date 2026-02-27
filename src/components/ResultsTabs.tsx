"use client";

import { useState } from "react";
import { LearningMaterials } from "@/lib/types";
import AudioPlayer from "./AudioPlayer";
import MindMap from "./MindMap";
import FlashcardDeck from "./FlashcardDeck";
import QuizGame from "./QuizGame";
import ExplanationViewer from "./ExplanationViewer";

interface ResultsTabsProps {
  data: LearningMaterials;
  onReset: () => void;
}

const TABS = [
  { id: "audio", icon: "🎧", label: "Audio" },
  { id: "mindmap", icon: "🗺", label: "Mind Map" },
  { id: "flashcards", icon: "🃏", label: "Flashcards" },
  { id: "quiz", icon: "🧪", label: "Quiz" },
  { id: "explain", icon: "💡", label: "Explanations" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ResultsTabs({ data, onReset }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("audio");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <span className="text-white font-semibold">Multilearn</span>
          </div>
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            ← New material
          </button>
        </div>

        {/* Tab bar */}
        <div className="max-w-3xl mx-auto px-4 pb-0">
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-purple-400 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === "audio" && <AudioPlayer summary={data.summary} />}
        {activeTab === "mindmap" && <MindMap data={data.mindMap} />}
        {activeTab === "flashcards" && <FlashcardDeck cards={data.flashcards} />}
        {activeTab === "quiz" && <QuizGame questions={data.quiz} />}
        {activeTab === "explain" && <ExplanationViewer explanations={data.explanations} />}
      </div>
    </div>
  );
}
