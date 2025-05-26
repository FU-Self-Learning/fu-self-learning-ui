"use client";
import { useState } from "react";
import FlashCardSection from "@/components/flashCardSection";
import Link from 'next/link';

const tabs = ["Flashcards", "Learn", "Test"];

// Mock data 
const flashcards = [
  { id: 1, title: 'Flashcard 1', description: 'Description for flashcard 1' },
  { id: 2, title: 'Flashcard 2', description: 'Description for flashcard 2' },
  { id: 3, title: 'Flashcard 3', description: 'Description for flashcard 3' },
  // Add more flashcards as needed
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((flashcard) => (
            <Link 
              href={`/flashcards/${flashcard.id}`} 
              key={flashcard.id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2">{flashcard.title}</h2>
                <p className="text-gray-600">{flashcard.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
