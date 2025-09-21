import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-white">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
