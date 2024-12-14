import HeroSection from '@/pages/home/components/hero.tsx';
import React, { useEffect } from 'react';
import FeaturesSection from './components/features.tsx';
import HowItWorks from './components/how-it-works.tsx';
import 'aos/dist/aos.css';
import AOS from 'aos';

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
    </div>
  );
};

export default Home;
