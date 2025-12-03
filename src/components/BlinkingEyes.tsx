"use client";

import { motion } from "framer-motion";

export function BlinkingEyes() {
  return (
    <div className="flex gap-8 items-center justify-center">
      <motion.div
        className="w-16 h-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)]"
        animate={{
          scaleY: [1, 0.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.05, 0.1],
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div
        className="w-16 h-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)]"
        animate={{
          scaleY: [1, 0.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.05, 0.1],
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  );
}
