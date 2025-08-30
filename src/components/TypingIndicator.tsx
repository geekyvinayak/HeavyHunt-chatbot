"use client"

import { motion, Transition } from "framer-motion"

export default function TypingIndicator() {
  const bounceTransition: { y: Transition } = {
    y: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeOut", // This is now typed correctly
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-tl-none flex items-center space-x-1">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ ...bounceTransition.y, delay: 0 }}
          className="w-2 h-2 bg-gray-500 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ ...bounceTransition.y, delay: 0.2 }}
          className="w-2 h-2 bg-gray-500 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ ...bounceTransition.y, delay: 0.4 }}
          className="w-2 h-2 bg-gray-500 rounded-full"
        />
      </div>
    </motion.div>
  )
}
