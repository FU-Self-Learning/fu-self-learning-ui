export const TAB_FLASHCARDS = "Flashcards";
export const TAB_LEARN = "Learn";

export const FLASHCARD_TABS = [TAB_FLASHCARDS, TAB_LEARN] as const;

export type FlashcardTab = typeof FLASHCARD_TABS[number];