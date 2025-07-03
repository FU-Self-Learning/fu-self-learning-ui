export const FLASHCARD_TABS = ['Flashcards', 'Learn'] as const;

export type FlashcardTab = (typeof FLASHCARD_TABS)[number];
