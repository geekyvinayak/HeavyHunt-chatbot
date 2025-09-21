'use client';

import { useState } from 'react';

export default function Search() {
  const [advanced, setAdvanced] = useState(false);
  const [prompt, setPrompt] = useState(
    "Find all used Kobelco SK140 excavators, 2018–2022, under 3,000 hours, near 79936 for under $135k"
  );

  const chips = [
    { label: "Make/Model", value: "Kobelco SK140" },
    { label: "Years", value: "2018–2022" },
    { label: "Max Hours", value: "≤ 3,000" },
    { label: "ZIP", value: "79936" },
    { label: "Budget", value: "≤ $135k" },
  ];

  return (
    <section id="search" className="mx-auto max-w-5xl px-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 shadow-2xl shadow-black/30">
        <label className="text-sm text-white/70">Describe your need</label>
        <div className="mt-2 flex flex-col md:flex-row gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 rounded-2xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-300/60"
            placeholder="Tell the broker your make/model, year range, hours cap, ZIP, and budget"
          />
          <button className="rounded-2xl px-5 py-3 bg-yellow-300 text-black font-semibold hover:bg-yellow-200 transition">Search</button>
        </div>

        {/* Chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/85">
              <span className="text-white/60">{c.label}:</span> {c.value}
            </span>
          ))}
          <button className="text-xs underline text-white/70 hover:text-white" onClick={() => setAdvanced((v) => !v)}>
            {advanced ? "Hide AI Broker Elite" : "Open AI Broker Elite"}
          </button>
        </div>

        {/* Advanced panel */}
        {advanced && (
          <div className="mt-4 grid md:grid-cols-3 gap-3">
            {[
              { label: "Intended use", placeholder: "light construction / rental / export" },
              { label: "Attachments", placeholder: "thumb, QC, aux hyd., U/C %" },
              { label: "Emissions / export", placeholder: "Tier 4 Final, CE, MX/CO ready" },
              { label: "Budget", placeholder: "$110k–$140k" },
              { label: "Urgency", placeholder: "1–5" },
              { label: "Ship to ZIP", placeholder: "79936" },
              { label: "CRM tag", placeholder: "Contact Now / Save / Recheck 10 days" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col">
                <label className="text-xs text-white/60">{f.label}</label>
                <input className="mt-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300/50" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
