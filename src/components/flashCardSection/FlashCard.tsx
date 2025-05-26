import { motion } from "framer-motion";

interface FlashCardProps {
  data: { front: string; back: string };
  flipped: boolean;
}

export default function FlashCard({ data, flipped }: FlashCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-xl h-72 mx-auto">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-semibold px-6 text-center transition hover:shadow-2xl">
            {data.front}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-full bg-blue-50 border border-blue-200 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-semibold px-6 text-center transition hover:shadow-2xl">
            {data.back}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
