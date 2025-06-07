import Link from 'next/link';
import { useFlashcard } from '@/hooks/useFlashcard';

export default function FlashCardList() {
  const { flashcards, loading, error } = useFlashcard();

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {flashcards.map((card) => (
          <Link 
            href={`/flashcards/${card.id}`} 
            key={card.id}
            className="block"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow min-h-[150px]">
              <h2 className="text-2xl font-semibold mb-4">{card.front_text}</h2>
              <p className="text-lg text-gray-600">{card.back_text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 