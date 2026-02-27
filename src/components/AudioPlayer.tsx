"use client";

import { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  summary: string;
}

export default function AudioPlayer({ summary }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startSpeaking = (startChar = 0) => {
    window.speechSynthesis.cancel();

    const textToSpeak = summary.slice(startChar);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speed;

    utterance.onboundary = (e) => {
      charIndexRef.current = startChar + e.charIndex;
      setProgress(((startChar + e.charIndex) / summary.length) * 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      charIndexRef.current = 0;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlay = () => {
    if (!supported) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      startSpeaking(0);
      setProgress(0);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    charIndexRef.current = 0;
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying || isPaused) {
      const savedChar = charIndexRef.current;
      window.speechSynthesis.cancel();
      // Small delay to let cancel settle
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(summary.slice(savedChar));
        utterance.rate = newSpeed;
        utterance.onboundary = (e) => {
          charIndexRef.current = savedChar + e.charIndex;
          setProgress(((savedChar + e.charIndex) / summary.length) * 100);
        };
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setProgress(100);
          charIndexRef.current = 0;
        };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
      }, 100);
    }
  };

  const speeds = [0.75, 1, 1.25, 1.5];

  return (
    <div className="space-y-6">
      {/* Player controls */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Audio Summary</h3>
          {!supported && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
              TTS not supported in this browser
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-4">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              disabled={!supported}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors disabled:opacity-40"
            >
              <span>{isPaused ? "▶ Resume" : "▶ Play"}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-40"
          >
            ■ Stop
          </button>

          {/* Speed controls */}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-slate-400 text-xs mr-1">Speed:</span>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  speed === s
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary text */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h4 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">
          Summary Text
        </h4>
        <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>
      </div>
    </div>
  );
}
