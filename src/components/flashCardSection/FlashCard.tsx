import { motion } from "framer-motion";
import { Flashcard } from "@/hooks/useFlashcard";

interface FlashCardProps {
  data: Flashcard;
  flipped: boolean;
  onFlip?: () => void;
  index?: number;
  total?: number;
}

export default function FlashCard({ data, flipped, onFlip, index, total }: FlashCardProps) {
  return (
    <div
      className="perspective-1000 w-full max-w-4xl h-96 mx-auto cursor-pointer"
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="absolute top-2 right-4 text-xs text-gray-400 font-medium">
            {index} / {total}
          </div>

          <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-xl flex items-center justify-center text-4xl font-semibold px-8 text-center">
            {data.front_text}
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="absolute top-2 right-4 text-xs text-gray-400 font-medium">
            {index} / {total}
          </div>

          <div className="w-full h-full bg-blue-50 border border-blue-200 rounded-2xl shadow-xl flex items-center justify-center text-4xl font-semibold px-8 text-center">
            {data.back_text}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
