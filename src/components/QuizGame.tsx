"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";

interface QuizGameProps {
  questions: QuizQuestion[];
}

type AnswerState = "unanswered" | "correct" | "wrong";

export default function QuizGame({ questions }: QuizGameProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );

  const current = questions[questionIndex];
  const total = questions.length;

  const handleSelect = (optionIndex: number) => {
    if (answerState !== "unanswered") return;

    const isCorrect = optionIndex === current.answerIndex;
    setSelectedOption(optionIndex);
    setAnswerState(isCorrect ? "correct" : "wrong");

    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (questionIndex < total - 1) {
      setQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState("unanswered");
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswerState("unanswered");
    setScore(0);
    setFinished(false);
    setAnswers(new Array(total).fill(null));
  };

  const getOptionStyle = (optionIndex: number) => {
    if (answerState === "unanswered") {
      return "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer";
    }
    if (optionIndex === current.answerIndex) {
      return "border-green-500/50 bg-green-500/10 text-green-300";
    }
    if (optionIndex === selectedOption && optionIndex !== current.answerIndex) {
      return "border-red-500/50 bg-red-500/10 text-red-300";
    }
    return "border-white/5 bg-white/3 opacity-50";
  };

  const scorePercent = Math.round((score / total) * 100);

  if (finished) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="text-6xl">
          {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "👍" : "📚"}
        </div>
        <div>
          <div className="text-4xl font-bold text-white mb-1">
            {score}/{total}
          </div>
          <div className="text-slate-400 text-lg">
            {scorePercent}% correct
          </div>
        </div>
        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            scorePercent >= 80
              ? "bg-green-500/20 text-green-300"
              : scorePercent >= 60
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {scorePercent >= 80
            ? "Excellent! You've got this."
            : scorePercent >= 60
            ? "Good effort! Review the missed ones."
            : "Keep studying — review the flashcards."}
        </div>

        {/* Answer review */}
        <div className="text-left space-y-3 mt-6">
          {questions.map((q, i) => {
            const chosen = answers[i];
            const correct = chosen === q.answerIndex;
            return (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  correct
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">{correct ? "✓" : "✗"}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{q.question}</p>
                    {!correct && (
                      <p className="text-slate-400 text-xs mt-1">
                        Correct: {q.options[q.answerIndex]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-slate-400 text-sm">{questionIndex + 1}/{total}</span>
        <span className="text-green-400 text-sm">{score} correct</span>
      </div>

      {/* Question */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
          Question {questionIndex + 1}
        </div>
        <p className="text-white text-lg font-medium leading-snug">
          {current.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${getOptionStyle(i)}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm flex-shrink-0 ${
                  answerState === "unanswered"
                    ? "border-white/20"
                    : i === current.answerIndex
                    ? "border-green-400 bg-green-400/20 text-green-300"
                    : i === selectedOption
                    ? "border-red-400 bg-red-400/20 text-red-300"
                    : "border-white/10"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation + Next */}
      {answerState !== "unanswered" && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border text-sm ${
              answerState === "correct"
                ? "border-green-500/30 bg-green-500/10 text-green-200"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
            }`}
          >
            <span className="font-semibold">
              {answerState === "correct" ? "✓ Correct! " : "✗ Not quite. "}
            </span>
            {current.explanation}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
          >
            {questionIndex < total - 1 ? "Next Question →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
