import React, { memo } from 'react';
import Hero from '../../components/sections/Hero';
import Features from '../../components/sections/Features';
import Technology from '../../components/sections/Technology';
import SelfientPartnership from '../../components/sections/SelfientPartnership';
import FractionalRobots from '../../components/sections/FractionalRobots';
import GovernanceProposals from '../../components/GovernanceProposals/GovernanceProposals';
import Ecosystem from '../../components/sections/Ecosystem';

const HomePage: React.FC = memo(() => {
  return (
    <>
      <Hero />
      <Features />
      <Technology />
      <SelfientPartnership />
      <FractionalRobots />
      <GovernanceProposals />
      <Ecosystem />
    </>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;