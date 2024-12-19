import HeroSection from '@/pages/home/components/hero.tsx';
import React, { useEffect } from 'react';
import FeaturesSection from './components/features.tsx';
import HowItWorks from './components/how-it-works.tsx';
import 'aos/dist/aos.css';
import AOS from 'aos';
import FAQSection from './components/faq.tsx';
import Footer from '@/components/footer.tsx';
import Header from '@/components/header.tsx';

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <FAQSection />
      <Footer />
    </>
  );
};

export default Home;
