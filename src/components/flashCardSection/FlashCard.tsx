import { motion } from "framer-motion";

interface FlashCardProps {
  data: { front: string; back: string };
  flipped: boolean;
  onFlip?: () => void;
  index?: number;
  total?: number;
}

export default function FlashCard({ data, flipped, onFlip, index, total }: FlashCardProps) {
  return (
    <div
      className="perspective-1000 w-full max-w-xl h-72 mx-auto cursor-pointer"
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

          <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-semibold px-6 text-center">
            {data.front}
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="absolute top-2 right-4 text-xs text-gray-400 font-medium">
            {index} / {total}
          </div>

          <div className="w-full h-full bg-blue-50 border border-blue-200 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-semibold px-6 text-center">
            {data.back}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
