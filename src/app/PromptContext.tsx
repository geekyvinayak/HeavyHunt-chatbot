// PromptContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type PromptContextType = {
  prompt: string;
  setPrompt: (p: string) => void;
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [prompt, setPrompt] = useState('');
  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const ctx = useContext(PromptContext);
  if (!ctx) throw new Error('usePrompt must be used inside PromptProvider');
  return ctx;
};
