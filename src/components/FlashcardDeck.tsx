"use client";

import { useState } from "react";
import { Flashcard } from "@/lib/types";

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export default function FlashcardDeck({ cards: initialCards }: FlashcardDeckProps) {
  const [cards, setCards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set());

  const current = cards[index];
  const total = cards.length;

  const goTo = (i: number) => {
    setFlipped(false);
    setTimeout(() => setIndex(i), 150);
  };

  const prev = () => { if (index > 0) goTo(index - 1); };
  const next = () => { if (index < total - 1) goTo(index + 1); };

  const markKnown = () => {
    setKnownIds((prev) => new Set([...prev, index]));
    if (index < total - 1) goTo(index + 1);
  };

  const shuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setFlipped(false);
    setKnownIds(new Set());
  };

  const isKnown = knownIds.has(index);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-slate-400 text-sm whitespace-nowrap">
          {index + 1} / {total}
        </span>
        {knownIds.size > 0 && (
          <span className="text-green-400 text-sm">{knownIds.size} known ✓</span>
        )}
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: 1200, height: 240 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 rounded-2xl border flex flex-col items-center justify-center p-8 text-center ${
              isKnown
                ? "border-green-500/30 bg-green-500/5"
                : "border-white/10 bg-white/5"
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-4">Question</div>
            <p className="text-white text-xl font-medium leading-snug">{current.front}</p>
            <div className="mt-6 text-slate-500 text-xs">Click to reveal answer</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-purple-500/30 bg-purple-500/5 flex flex-col items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-xs uppercase tracking-widest text-purple-400 mb-4">Answer</div>
            <p className="text-white text-lg leading-relaxed">{current.back}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm disabled:opacity-30 transition-colors"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={markKnown}
            disabled={isKnown}
            className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-xl text-sm disabled:opacity-40 transition-colors"
          >
            ✓ Got it
          </button>
          <button
            onClick={shuffle}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm transition-colors"
          >
            ⇄ Shuffle
          </button>
        </div>

        <button
          onClick={next}
          disabled={index === total - 1}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Card dots */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index
                ? "bg-purple-400"
                : knownIds.has(i)
                ? "bg-green-500"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
