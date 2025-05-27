"use client";
import { useState, useCallback, useEffect } from "react";
import FlashCard from "./FlashCard";
import FlashCardControls from "./FlashCardControls";
import { useFlashcard } from "@/hooks/useFlashcard";

interface SectionProps { mode: string; }

export default function FlashCardSection({ mode }: SectionProps) {
  const { flashcards, loading, error } = useFlashcard();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(flashcards);

  useEffect(() => {
    if (flashcards.length > 0) {
      setShuffledCards(flashcards);
    }
  }, [flashcards]);

  const total = flashcards.length;
  const card = shuffledCards[questionIdx];

  const next = useCallback(() => {
    setQuestionIdx(i => (i + 1) % total);
    setFlipped(false);
  }, [total]);

  const prev = useCallback(() => {
    setQuestionIdx(i => (i - 1 + total) % total);
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
    setQuestionIdx(0);
    setFlipped(false);
  }, [shuffledCards]);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading flashcards...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  if (!flashcards || flashcards.length === 0) {
    return <div className="container mx-auto px-4 py-8">No flashcards available.</div>;
  }

  if (!card) {
    return <div className="container mx-auto px-4 py-8">Loading card data...</div>;
  }

  return (
    <section className="space-y-6">
      {/* Flashcard mode */}
      {mode === "Flashcards" && (
        <>
          <FlashCard 
            data={card} 
            flipped={flipped} 
            onFlip={flip} 
            index={questionIdx + 1} 
            total={flashcards.length} 
          />

          <FlashCardControls
            onPrev={prev}
            onFlip={flip}
            onNext={next}
            onShuffle={shuffle}
            onFullscreen={handleFullscreen}
            showExtras
          />
          <div className="text-center text-sm text-gray-400">
            Created by <span className="font-medium text-gray-500">hongphuc</span>
          </div>
        </>
      )}

      {/* Learn mode */}
      {mode === "Learn" && (
        <div className="grid gap-6">
          {shuffledCards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-md"
            >
              <div className="flex justify-between items-start gap-6">
                {/* Front */}
                <div className="flex-1 text-center space-y-2">
                  <div className="text-2xl font-semibold text-gray-800">{c.front_text}</div>
                </div>

                {/* Back */}
                <div className="flex-1 text-center space-y-2">
                  <div className="text-2xl font-semibold text-blue-600">{c.back_text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
