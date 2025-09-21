export default function HowItWorks() {
  const steps = [
    {
      title: "Describe your need",
      body: "Type one sentence or drop a voice note. The broker understands specs, hours, ZIP and budget.",
    },
    {
      title: "We hunt & score",
      body: "Agent searches 200+ sources, dedupes VINs, checks comps and flags risks in minutes.",
    },
    {
      title: "Decide & move",
      body: "Contact-ready intros, negotiation pointers and freight estimate to your ZIP.",
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 pb-24">
      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((c, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-white/80 text-sm">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
