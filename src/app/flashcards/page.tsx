"use client";
import { useState } from "react";
import FlashCardSection from "@/components/flashCardSection";
import FlashCardList from "@/components/flashCardSection/FlashCardList";
import { FLASHCARD_TABS, FlashcardTab } from "@/components/common/constants/tab";

export default function FlashCardsPage() {
  const [activeTab, setActiveTab] = useState<FlashcardTab>(FLASHCARD_TABS[0]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <nav className="flex justify-center gap-6 pb-2">
        {FLASHCARD_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`z-10 relative text-lg font-medium pb-2 transition-colors ${activeTab === tab
              ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
              : "text-gray-500 hover:text-blue-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="max-w-5xl mx-auto">
        <FlashCardSection mode={activeTab} />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">All Flashcards</h2>
        <FlashCardList />
      </div>
    </main>
  );
}
