'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import FeatureCard from '@/components/FeatureCard';
import { useChat } from '@/hooks/useChat';
import Image from 'next/image';

export default function ChatInterface() {
  const {
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    messagesEndRef,
    messagesContainerRef,
    inputRef,
    handleSubmit,
    isChatCompleted,
    startNewChat
  } = useChat();

  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  const hasMessages = messages.length > 0;

  const handleCardClick = (message: string) => {
    setInput(message);
    // Use setTimeout to ensure the input is updated before submitting
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const featureCards = [
    {
      icon: "Wrench",
      title: "I need an excavator for construction",
      description: "Heavy-duty excavation work",
      message: "I need an excavator for construction work",
    },
    {
      icon: "Wrench",
      title: "Looking for a bulldozer",
      description: "Land clearing and grading",
      message: "I'm looking for a bulldozer for land clearing",
    },
    {
      icon: "Wrench",
      title: "Need a crane for lifting",
      description: "Heavy lifting operations",
      message: "I need a crane for heavy lifting operations",
    },
    {
      icon: "Wrench",
      title: "Forklift for warehouse",
      description: "Material handling equipment",
      message: "I need a forklift for warehouse operations",
    },
    {
      icon: "Wrench",
      title: "Road construction equipment",
      description: "Pavers and compactors",
      message: "I need road construction equipment like pavers",
    },
    {
      icon: "Wrench",
      title: "Mining equipment needed",
      description: "Heavy machinery for mining",
      message: "I need heavy machinery for mining operations",
    },
  ];

  return (
    <div className="flex items-center p-2 justify-center h-screen bg-white text-black chatbot-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl p-6 rounded-xl h-full justify-between flex flex-col shadow-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-2"
          >
            <Image src="/heavyhuntlogo.webp" alt="Logo" width={100} height={100} />
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-center"
          >
            How can I help you find heavy machinery today?
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 text-center mt-2 max-w-md"
          >
            Tell me what type of heavy machinery you need or select an option below.
          </motion.p>
        </div>

        <LayoutGroup>
          <AnimatePresence mode="wait">
            {mounted && !hasMessages ? (
              <motion.div
                key="feature-cards"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50, height: 0 }}
                transition={{
                  duration: 0.5,
                  staggerChildren: 0.1,
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                {featureCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <FeatureCard
                      icon={card.icon}
                      title={card.title}
                      description={card.description}
                      onClick={() => handleCardClick(card.message)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="message-history"
                initial={{ opacity: 0, height: 0, y: 50 }}
                animate={{ opacity: 1, height: "300px", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -50 }}
                transition={{
                  duration: 0.5,
                  height: { type: "spring", stiffness: 100, damping: 15 },
                }}
                className="bg-gray-50 rounded-lg flex-1 p-4 mb-4 h-full overflow-y-auto border-2 border-gray-200"
                ref={messagesContainerRef}
              >
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                </AnimatePresence>

                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {isChatCompleted ? (
          // Show "Start New Chat" button when chat is completed
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewChat}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#8360c3] to-[#2ebf91] text-white font-medium shadow-lg"
            >
              🔄 Start New Chat
            </motion.button>
          </motion.div>
        ) : (
          // Show normal input form when chat is active
          <motion.form
            ref={formRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about heavy machinery..."
                className="w-full px-4 py-3 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-full bg-black text-white disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}