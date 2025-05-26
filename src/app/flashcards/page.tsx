"use client";
import { useState } from "react";
import FlashCardSection from "@/components/flashCardSection";
import FlashCardList from '@/components/flashCardSection/FlashCardList';

const tabs = ["Flashcards", "Learn", "Test"];

const mockFlashCards = [
  {
    id: '1',
    front: 'What is React?',
    back: 'A JavaScript library for building user interfaces'
  },
  {
    id: '2',
    front: 'What is Next.js?',
    back: 'A React framework for production'
  },
  {
    id: '3',
    front: 'What is TypeScript?',
    back: 'A typed superset of JavaScript'
  }
];

export default function FlashCardsPage() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <nav className="flex justify-center gap-6 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`z-10 relative text-lg font-medium pb-2 transition-colors ${
              activeTab === tab
                ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <FlashCardSection mode={activeTab} />

      <FlashCardList cards={mockFlashCards} />
    </main>
  );
}
