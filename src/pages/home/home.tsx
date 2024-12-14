import HeroSection from '@/pages/home/hero/hero.tsx';
import React from 'react';
import FeaturesSection from './features/features.tsx';

const Home: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
