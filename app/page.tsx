import Header from '@/app/components/layout/header';
import Footer from '@/app/components/layout/footer';
import Hero from '@/app/components/sections/hero';
import OfferBanner from '@/app/components/sections/offerbanner';
import MenuSection from '@/app/components/sections/menusection';
import CartDrawer from '@/app/components/layout/cartdrawer';

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