"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import LoadingView from "@/components/LoadingView";
import ResultsTabs from "@/components/ResultsTabs";
import { LearningMaterials } from "@/lib/types";

type AppState = "input" | "loading" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("input");
  const [data, setData] = useState<LearningMaterials | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (text: string) => {
    setError(null);
    setAppState("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const result: LearningMaterials = await res.json();
      setData(result);
      setAppState("results");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setAppState("input");
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setAppState("input");
  };

  if (appState === "loading") return <LoadingView />;
  if (appState === "results" && data) return <ResultsTabs data={data} onReset={handleReset} />;

  return (
    <>
      <UploadForm onSubmit={handleSubmit} isLoading={appState === "loading"} />
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-3 rounded-xl text-sm max-w-sm text-center">
          {error}
        </div>
      )}
    </>
  );
}
