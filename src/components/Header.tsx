export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/0 bg-black/10 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-yellow-400/20 border border-yellow-300/30 grid place-items-center text-yellow-300 font-bold">HH</div>
          <span className="text-xl font-semibold tracking-wide">HEAVYHUNT</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a className="hover:text-white" href="#search">Search</a>
          <a className="hover:text-white" href="#deals">Live Deals</a>
          <a className="hover:text-white" href="#how">How it works</a>
        </nav>
        <button className="hidden md:inline-flex rounded-xl px-4 py-2 bg-[#fdc820] text-black font-medium hover:bg-yellow-200 transition">Sign in</button>
      </div>
    </header>
  );
}
