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
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer transition-all"
    >
      <motion.div
        className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center"
        whileHover={{ rotate: 5 }}
      >
        <Icon className="w-6 h-6 text-black" />
      </motion.div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  )
}
