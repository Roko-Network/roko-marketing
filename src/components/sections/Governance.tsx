import { FC, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrophyIcon
  // DocumentTextIcon, ShieldCheckIcon removed - Issues #13, #15
} from '@heroicons/react/24/outline';
import styles from './Governance.module.css';

interface DAOStats {
  totalSupply: string;
  totalHolders: string;
  avgVotingPower: string;
  // Staking, validator, and treasury data removed
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  timeRemaining: string;
  category: 'treasury' | 'governance' | 'technical' | 'community';
}

// TreasuryAllocation interface removed - Issue #14

const daoStats: DAOStats = {
  totalSupply: '1,000,000,000',
  totalHolders: '89,432',
  avgVotingPower: '2.8%'
  // Staking, validator, and treasury data removed
};

const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Increase Validator Node Requirements',
    description: 'Proposal to increase minimum hardware requirements for validator nodes to improve network performance.',
    status: 'active',
    votesFor: 4500000,
    votesAgainst: 1200000,
    quorum: 5000000,
    timeRemaining: '5 days',
    category: 'technical'
  },
  {
    id: 'prop-002',
    title: 'Community Grant Program Funding',
    description: 'Allocate 5M ROKO tokens for developer grants and ecosystem development initiatives.',
    status: 'active',
    votesFor: 8900000,
    votesAgainst: 2100000,
    quorum: 10000000,
    timeRemaining: '2 days',
    category: 'treasury'
  },
  {
    id: 'prop-003',
    title: 'Governance Token Burn Mechanism',
    description: 'Implement quarterly token burn based on network revenue to reduce total supply.',
    status: 'passed',
    votesFor: 15600000,
    votesAgainst: 3400000,
    quorum: 15000000,
    timeRemaining: 'Ended',
    category: 'governance'
  }
];

// Treasury allocations data removed - Issue #14

// This component is being removed per issue #30
export const Governance: FC = () => {
  return null;
};

export default Governance;