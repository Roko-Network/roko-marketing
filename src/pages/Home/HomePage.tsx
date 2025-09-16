import React, { memo } from 'react';
import { Hero } from '@components/sections/Hero';
import { Features } from '@components/sections/Features';
import { Technology } from '@components/sections/Technology';
import { Governance } from '@components/sections/Governance';
import { Ecosystem } from '@components/sections/Ecosystem';

const HomePage: React.FC = memo(() => {
  return (
    <>
      <Hero />
      <Features />
      <Technology />
      <Governance />
      <Ecosystem />
    </>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;