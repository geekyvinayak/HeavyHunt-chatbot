import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[32rem] w-[32rem] rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="absolute top-20 right-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl" />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Find verified heavy equipment in minutes
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/80">
          Your AI Broker searches 200+ sources, scores every deal, and helps you negotiate.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#search" className="rounded-2xl px-6 py-3 bg-yellow-300 text-black font-semibold hover:bg-yellow-200 transition shadow-lg shadow-yellow-300/10">
            Start a search
          </a>
          <Link href="/chat" className="rounded-2xl px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 transition">
            Talk to the AI Broker
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-8 text-xs md:text-sm text-white/60">
          Pulling listings from: MachineryTrader • Ritchie Bros. • IronPlanet • BigIron • OEM dealers • Private party
        </div>
      </div>
    </section>
  );
}
