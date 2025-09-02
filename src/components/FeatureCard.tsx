"use client"

import { motion } from "framer-motion"
import { BookOpen, ImageIcon, Globe, Wrench, type LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  onClick?: () => void
}

export default function FeatureCard({ icon, title, description, onClick }: FeatureCardProps) {
  const iconMap: Record<string, LucideIcon> = {
    BookOpen,
    ImageIcon,
    Globe,
    Wrench,
  }

  const Icon = iconMap[icon] || Wrench

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.03,
        boxShadow: "0 0 25px rgba(253, 200, 32, 0.35)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative bg-white/5 border border-gray-700/40 backdrop-blur-xl p-2 rounded-2xl text-center cursor-pointer transition-all duration-300"
    >
      {/* Icon wrapper */}
      <motion.div
        className="w-14 h-14 mx-auto mb-4 bg-[#242424] rounded-full flex items-center justify-center transition-all duration-300  "
        whileHover={{ rotate: 5 }}
      >
       <Icon
  className="w-8 h-8 text-gray-400  transition-colors duration-300 group-hover:text-yellow-400  "
/>

      </motion.div>

      {/* Title */}
      <h3
        className="font-semibold mb-2 text-gray-300 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-200"
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500">{description}</p>

      {/* Glow overlay effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-transparent blur-xl pointer-events-none" />
    </motion.div>
  )
}
