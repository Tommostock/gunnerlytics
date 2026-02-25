import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPlayerIndex, getAllPlayers } from "@/lib/data";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Players — Gunnerlytics",
  description: "Compare Arsenal legends side-by-side with detailed stats, radar charts, and performance metrics.",
};

export default function ComparePage() {
  const index = getAllPlayerIndex();
  const allPlayers = getAllPlayers();
  return (
    <Suspense fallback={<CompareLoading />}>
      <CompareClient index={index} allPlayers={allPlayers} />
    </Suspense>
  );
}

function CompareLoading() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-arsenal-red">Compare</span> Players
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto">
          Select 2-3 Arsenal players to compare side by side
        </p>
      </div>
      <div className="animate-pulse h-12 rounded-xl bg-surface-200 dark:bg-surface-800" />
    </div>
  );
}
