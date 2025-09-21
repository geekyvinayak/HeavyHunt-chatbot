import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Search from '@/components/Search';
import LiveDeals from '@/components/LiveDeals';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Search />
      <LiveDeals />
      <HowItWorks />
    </Layout>
  );
}
