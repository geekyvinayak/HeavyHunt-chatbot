'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrompt } from '@/app/PromptContext';


export default function Search() {
  const router = useRouter();
  const [advanced, setAdvanced] = useState(false);
  const { setPrompt: setGlobalPrompt } = usePrompt();
  const [advancedFields, setAdvancedFields] = useState({
    machineType: 'Excavator',
    machineCondition: 'Used',
    source: 'Dealer',
    expectedDelivery: '1 month',
    budget: '$50k–$150k',
    intendedUse: 'Rental',
  });

  const fieldLabels: Record<keyof typeof advancedFields, string> = {
    machineType: 'Type',
    machineCondition: 'Condition',
    source: 'Source',
    expectedDelivery: 'Expected Delivery',
    budget: 'Budget',
    intendedUse: 'Intended Use',
  };

  const [prompt, setPrompt] = useState('Find all used');

  useEffect(() => {
    const advancedText = Object.entries(advancedFields)
      .map(([key, value]) => `${fieldLabels[key as keyof typeof advancedFields]}: ${value}`)
      .join(', ');

    setPrompt(`Find all used, ${advancedText}`);
  }, [advancedFields]);

  const handleAdvancedChange = (key: keyof typeof advancedFields, value: string) => {
    setAdvancedFields((prev) => ({ ...prev, [key]: value }));
  };

 const handleSearch = () => {
  setGlobalPrompt(prompt); // save prompt in context
  router.push('/chat');    // navigate normally
};

  return (
    <section id="search" className="mx-auto max-w-5xl px-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 shadow-2xl shadow-black/30">
        <label className="text-sm text-white/70">Describe your need</label>
        <div className="mt-2 flex flex-col md:flex-row gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 rounded-2xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-300/60"
            placeholder="Tell the broker your details"
          />
          <button
            onClick={handleSearch}
            className="rounded-2xl px-5 py-3 bg-[#fdc820] text-black font-semibold hover:bg-yellow-200 transition"
          >
            Search
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="text-xs underline text-white/70 hover:text-white"
            onClick={() => setAdvanced((v) => !v)}
          >
            {advanced ? 'Hide AI Broker Elite' : 'Open AI Broker Elite'}
          </button>
        </div>

        {advanced && (
          <div className="mt-4 grid md:grid-cols-3 gap-3">
            {[
              { key: 'machineType', label: 'Machine Type', placeholder: 'Excavator / Bulldozer / Loader' },
              { key: 'machineCondition', label: 'Condition', placeholder: 'New / Used / Refurbished' },
              { key: 'source', label: 'Source', placeholder: 'Dealer / Owner / Auction / Export' },
              { key: 'expectedDelivery', label: 'Expected Delivery', placeholder: '1–4 weeks, 1 month, ASAP' },
              { key: 'budget', label: 'Budget', placeholder: '$50k–$150k' },
              { key: 'intendedUse', label: 'Intended Use', placeholder: 'Construction / Rental / Export' },
            ].map((f) => {
              const fieldKey = f.key as keyof typeof advancedFields;
              return (
                <div key={fieldKey} className="flex flex-col">
                  <label className="text-xs text-white/60">{f.label}</label>
                  <input
                    value={advancedFields[fieldKey]}
                    onChange={(e) => handleAdvancedChange(fieldKey, e.target.value)}
                    className="mt-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300/50"
                    placeholder={f.placeholder}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
