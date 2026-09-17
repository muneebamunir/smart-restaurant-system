import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import OfferBanner from '@/components/sections/offerbanner';
import MenuSection from '@/components/sections/menusection';
import CartDrawer from '@/components/layout/cartdrawer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20 grow">
        <Hero />
        <OfferBanner />
        <MenuSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}