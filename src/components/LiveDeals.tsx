export default function LiveDeals() {
  const liveDeals = [
    {
      tag: "Best Local Buy",
      title: "2019 Kobelco SK140SR LC-5",
      price: "$128,500",
      hours: "2,480 h",
      distance: "22 mi",
      bullets: ["QC + Aux Hyd.", "UC 70%", "1-owner dealer"],
    },
    {
      tag: "Best Value Nationwide",
      title: "2020 Cat 315 GC",
      price: "$139,000",
      hours: "1,950 h",
      distance: "1,280 mi",
      bullets: ["Thumb ready", "Telematics", "Auction this week"],
    },
    {
      tag: "Watch for Price Drop",
      title: "2018 Deere 135G",
      price: "$119,900",
      hours: "3,400 h",
      distance: "610 mi",
      bullets: ["Private party", "Recent service", "No QC"],
    },
  ];

  return (
    <section id="deals" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">Live Deals</h2>
        <a className="text-sm text-white/70 hover:text-white" href="#">See all</a>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {liveDeals.map((d, i) => (
          <article key={i} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition">
            <div className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-2.5 py-1 bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {d.tag}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{d.title}</h3>
            <div className="mt-1 text-sm text-white/70">{d.price} • {d.hours} • {d.distance} away</div>
            <ul className="mt-3 space-y-1 text-sm text-white/80 list-disc list-inside">
              {d.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-xl bg-yellow-300 text-black font-semibold px-3 py-2 hover:bg-yellow-200">Contact seller</button>
              <button className="rounded-xl border border-white/15 px-3 py-2 text-white/90 hover:bg-white/5">Deal sheet</button>
              <button className="rounded-xl border border-white/15 px-3 py-2 text-white/90 hover:bg-white/5">Save</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
