import { useState, useEffect, useCallback } from 'react';

interface Topic {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: number;
  topic: Topic;
  front_text: string;
  back_text: string;
  created_at: string;
  updated_at: string;
}

interface UseFlashcardReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFlashcard(topicId: number = 1): UseFlashcardReturn {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:4000/api/v1/flashcards/topic/${topicId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      
      const data = await response.json();
      setFlashcards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching flashcards');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchFlashcards();
  }, [topicId, fetchFlashcards]);

  return {
    flashcards,
    loading,
    error,
    refetch: fetchFlashcards
  };
} 