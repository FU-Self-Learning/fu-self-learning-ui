/* File: src/components/flashCardSection/index.tsx */
"use client";
import { useState, useCallback } from "react";
import { Switch, Avatar, message } from "antd";
import FlashCard from "./FlashCard";
import FlashCardControls from "./FlashCardControls";

interface CardData {
  front: string;
  back: string;
  options?: string[];
  correctAnswer?: string;
}

interface SectionProps { mode: string; }

const cards: CardData[] = [
  {
    front: "バスてい",
    back: "Bus stop",
    options: ["Bus stop", "Train station", "Airport", "Taxi stand"],
    correctAnswer: "Bus stop"
  },
  {
    front: "ありがとうございます",
    back: "Thank you very much",
    options: ["Thank you very much", "You're welcome", "Good morning", "Goodbye"],
    correctAnswer: "Thank you very much"
  },
  {
    front: "おはようございます",
    back: "Good morning",
    options: ["Good morning", "Good evening", "Good night", "Good afternoon"],
    correctAnswer: "Good morning"
  },
  {
    front: "さようなら",
    back: "Goodbye",
    options: ["Goodbye", "Hello", "See you later", "Welcome"],
    correctAnswer: "Goodbye"
  },
  {
    front: "すみません",
    back: "Excuse me / I'm sorry",
    options: ["Excuse me / I'm sorry", "Thank you", "Good morning", "Goodbye"],
    correctAnswer: "Excuse me / I'm sorry"
  }
];

export default function FlashCardSection({ mode }: SectionProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<CardData[]>(cards);
  const total = cards.length;
  const card = shuffledCards[idx];

  const next = useCallback(() => {
    setIdx(i => (i + 1) % total);
    setFlipped(false);
  }, [total]);

  const prev = useCallback(() => {
    setIdx(i => (i - 1 + total) % total);
    setFlipped(false);
  }, [total]);

  const flip = useCallback(() => setFlipped(f => !f), []);

  const shuffle = useCallback(() => {
    const newShuffled = [...shuffledCards];
    for (let i = newShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
    }
    setShuffledCards(newShuffled);
    setIdx(0);
    setFlipped(false);
  }, [shuffledCards]);

  const handleSettings = useCallback(() => {
    // Settings logic
    message.info("Settings clicked! (This is a placeholder)");
  }, []);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  return (
    <section className="space-y-6">
      {/* Flashcard mode */}
      {mode === "Flashcards" && (
        <>
          <FlashCard data={card} flipped={flipped} />

          <FlashCardControls
            onPrev={prev}
            onFlip={flip}
            onNext={next}
            onShuffle={shuffle}
            onSettings={handleSettings}
            onFullscreen={handleFullscreen}
            showExtras
          />
          <div className="text-center text-sm text-gray-400">
            Created by <span className="font-medium text-gray-500">hongphuc</span>
          </div>
        </>
      )}

      {/* Learn mode: show both faces side by side */}
      {mode === "Learn" && (
        <div className="grid gap-4">
          {shuffledCards.map((c, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-white shadow-sm">
              <div className="text-center space-y-1">
                <div className="text-xs text-gray-400">Front</div>
                <div className="text-xl font-semibold">{c.front}</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xs text-gray-400">Back</div>
                <div className="text-xl font-semibold">{c.back}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test mode: Add content for the test mode */}
      {mode === "Test" && (
        <div className="p-4 bg-white border rounded shadow text-center">
          <h3 className="text-sm font-medium">Test Mode Coming Soon!</h3>
          <p className="text-gray-600">Content for the test mode will be added here.</p>
        </div>
      )}

    </section>
  );
}
