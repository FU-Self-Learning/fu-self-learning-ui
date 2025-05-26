import Link from 'next/link';

interface FlashCard {
  id: string;
  front: string;
  back: string;
}

interface FlashCardListProps {
  cards: FlashCard[];
}

export default function FlashCardList({ cards }: FlashCardListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flash Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link 
            href={`/flashcards/${card.id}`} 
            key={card.id}
            className="block"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{card.front}</h2>
              <p className="text-gray-600">{card.back}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 