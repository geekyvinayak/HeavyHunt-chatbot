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
    startNewChat,
    sessionId,
    chatContext
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

  console.log("leaddddd",chatContext)

  return (
    <div className="flex items-center p-2 justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white chatbot-container relative overflow-hidden">
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{backgroundColor: '#fdc820', opacity: 0.03}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/2 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 rounded-full blur-3xl" style={{backgroundColor: '#fdc820', opacity: 0.03}}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl p-6 rounded-2xl h-full justify-between flex flex-col backdrop-blur-xl bg-white/5 border border-gray-700/50 shadow-2xl relative z-10"
        style={{borderColor: 'rgba(253, 200, 32, 0.2)'}}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-2 p-4 rounded-2xl bg-gradient-to-br from-white/8 to-black/20 backdrop-blur-sm border-2 shadow-xl"
            style={{borderColor: '#fdc820'}}
          >
            <Image src="/heavyhuntlogo.webp" alt="Logo" width={200} height={200} className="drop-shadow-2xl" />
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold text-center bg-gradient-to-r from-white via-gray-200 bg-clip-text text-transparent drop-shadow-lg"
            style={{
              background: `linear-gradient(135deg, #ffffff 0%, #fdc820 50%, #ffffff 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            How can I help you find heavy machinery today?
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-300 text-center mt-2 max-w-md text-lg font-medium"
          >
            Tell me what type of heavy machinery you need or select an option below.
            session ID:{sessionId}
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
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
                className="backdrop-blur-xl bg-white/8 rounded-2xl flex-1 p-6 mb-4 h-full overflow-y-auto border shadow-inner"
                style={{borderColor: 'rgba(253, 200, 32, 0.3)'}}
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
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(253, 200, 32, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewChat}
              className="px-8 py-4 rounded-2xl text-black font-bold shadow-2xl border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, #fdc820 0%, #ffdd44 100%)`,
                borderColor: '#fdc820'
              }}
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
            className="flex items-center space-x-4"
          >
            <div className="relative flex-1">
              <input
  ref={inputRef}
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Ask me about heavy machinery..."
  className="
    w-full px-6 py-4 pr-12 rounded-2xl border-2 
    bg-white/5 backdrop-blur-xl text-white placeholder-gray-400 
    focus:outline-none shadow-lg transition-all duration-300 
    focus:shadow-xl
    border-[rgba(253,200,32,0.3)] 
    focus:border-[#fdc820] 
    focus:shadow-[0_0_20px_rgba(253,200,32,0.2)]
  "
/>
            </div>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 25px rgba(253, 200, 32, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-4 rounded-2xl text-black font-bold disabled:opacity-40 shadow-2xl border-2 transition-all duration-300 disabled:cursor-not-allowed"
              style={{
                background: isLoading || !input.trim() 
                  ? 'linear-gradient(135deg, #666 0%, #888 100%)'
                  : `linear-gradient(135deg, #fdc820 0%, #ffdd44 100%)`,
                borderColor: isLoading || !input.trim() ? '#666' : '#fdc820'
              }}
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}