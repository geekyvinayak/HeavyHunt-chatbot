"use client"

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  isUser?: boolean
  timestamp: Date
}

interface ChatResponse {
  response: string;
  isQueryCompleted: boolean; // keep it required, defaults handled in code
  summary?: string;
  unserviceable?: boolean; // fixed spelling
  userEmail?: string;
  leadContext?: Record<string, any>; // or a specific type if known
}

export function useChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`)
  const [isChatCompleted, setIsChatCompleted] = useState(false)
  const [chatContext,setChatContext]= useState({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to save query to database
  const saveQueryToDatabase = async (email: string, summary: string) => {
    try {
      const response = await fetch('/api/save-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          querySummary: summary,
        }),
      })

      if (response.ok) {
        console.log('Query saved successfully to database')
      } else {
        console.error('Failed to save query to database')
      }
    } catch (error) {
      console.error('Error saving query:', error)
    }
  }

  // Function to start a new chat
  const startNewChat = () => {
    setMessages([])
    setInput('')
    setIsChatCompleted(false)
    setIsLoading(false)
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`)
    inputRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId,
          leadContext:chatContext
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data: ChatResponse = await response.json()
      console.log("api response",data)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'bot',
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
      setChatContext(prev => ({
  ...prev,
  ...data.leadContext
}));

      // Handle completion or unserviceable requests
      if (data.isQueryCompleted && data.summary && data.userEmail) {
        setTimeout(() => {
          // const summaryMessage: Message = {
          //   id: (Date.now() + 2).toString(),
          //   content: `📋 **Summary of your request:**\n${data.summary}`,
          //   sender: 'bot',
          //   isUser: false,
          //   timestamp: new Date(),
          // }
          // setMessages(prev => [...prev, summaryMessage])

          // Save to database and mark chat as completed
          saveQueryToDatabase(data.userEmail!, data.summary!)
          setIsChatCompleted(true)
        }, 1000)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return {
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
  }
}