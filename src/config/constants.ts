// ROKO Network Brand Colors
export const COLORS = {
  primary: '#BAC0CC',     // ROKO Primary
  secondary: '#BCC1D1',   // ROKO Secondary
  tertiary: '#D9DBE3',    // ROKO Tertiary
  dark: '#181818',        // ROKO Dark
  teal: '#00d4aa',        // ROKO Teal accent

  // Extended palette
  white: '#FFFFFF',
  black: '#000000',

  // Background variations
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    dark: '#181818',
    accent: '#F0F2F4'
  },

  // Text variations
  text: {
    primary: '#181818',
    secondary: '#6B7280',
    light: '#9CA3AF',
    accent: '#00d4aa',
    inverse: '#FFFFFF'
  },

  // Border variations
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#6B7280'
  },

  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

// Typography Configuration
export const TYPOGRAPHY = {
  fontFamily: {
    display: 'Rajdhani, system-ui, sans-serif',
    body: 'HK Guise, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, Monaco, monospace'
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem'     // 128px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
} as const;

// Layout and Spacing
export const LAYOUT = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem'    // 128px
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px'
  }
} as const;

// Animation Configuration
export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 750
  },

  easing: {
    linear: 'cubic-bezier(0, 0, 1, 1)',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
} as const;

// ROKO Network Configuration
export const ROKO_NETWORK = {
  name: 'ROKO Network',
  tagline: 'The Temporal Layer for Web3',
  description: 'Build time-sensitive blockchain applications with nanosecond precision. IEEE 1588 PTP-grade synchronization for Web3.',

  // Network specifications
  specs: {
    blockTime: '1s',
    finalityTime: '3s',
    temporalPrecision: '< 1ns',
    consensus: 'Temporal Proof of Stake',
    timestampStandard: 'IEEE 1588 PTP'
  },

  // Social links
  social: {
    website: 'https://roko.network',
    docs: 'https://docs.roko.network',
    github: 'https://github.com/roko-network',
    discord: 'https://discord.gg/roko',
    telegram: 'https://t.me/rokonetwork',
    twitter: 'https://twitter.com/roko_network',
    medium: 'https://medium.com/@roko-network'
  }
} as const;

// Navigation Configuration
export const NAVIGATION = {
  main: [
    { label: 'Technology', path: '/technology', description: 'Temporal blockchain infrastructure' },
    { label: 'Governance', path: '/governance', description: 'Decentralized decision making' },
    { label: 'Developers', path: '/developers', description: 'Build on ROKO Network' },
    { label: 'Ecosystem', path: '/ecosystem', description: 'Partners and integrations' }
  ],

  footer: [
    {
      title: 'Technology',
      links: [
        { label: 'Temporal Layer', path: '/technology/temporal-layer' },
        { label: 'Consensus', path: '/technology/consensus' },
        { label: 'Architecture', path: '/technology/architecture' },
        { label: 'Security', path: '/technology/security' }
      ]
    },
    {
      title: 'Developers',
      links: [
        { label: 'Documentation', path: '/developers/docs' },
        { label: 'API Reference', path: '/developers/api' },
        { label: 'SDKs', path: '/developers/sdks' },
        { label: 'Tutorials', path: '/developers/tutorials' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', path: ROKO_NETWORK.social.discord, external: true },
        { label: 'Telegram', path: ROKO_NETWORK.social.telegram, external: true },
        { label: 'Twitter', path: ROKO_NETWORK.social.twitter, external: true },
        { label: 'GitHub', path: ROKO_NETWORK.social.github, external: true }
      ]
    }
  ]
} as const;

// API Configuration
export const API = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.roko.network',
  wsUrl: import.meta.env.VITE_WS_URL || 'wss://ws.roko.network',

  endpoints: {
    stats: '/stats',
    validators: '/validators',
    proposals: '/governance/proposals',
    blocks: '/blocks',
    transactions: '/transactions'
  },

  timeout: 10000,
  retries: 3
} as const;

// Web3 Configuration
export const WEB3_CONFIG = {
  chainId: 12227332, // ROKO Network chain ID (updated per specification)
  chainName: 'ROKO Network',
  rpcUrls: ['https://rpc.roko.network'],
  blockExplorerUrls: ['https://explorer.roko.network'],
  nativeCurrency: {
    name: 'ROKO',
    symbol: 'ROKO',
    decimals: 18
  },
  // Contract addresses
  contracts: {
    ROKO_TOKEN: '0x0000000000000000000000000000000000000000', // To be deployed
    PW_ROKO_TOKEN: '0x0000000000000000000000000000000000000000', // pwROKO staking token
    GOVERNANCE: '0x0000000000000000000000000000000000000000', // Governance contract
    REPUTATION_NFT: '0x0000000000000000000000000000000000000000', // ERC1155 reputation
    STAKING: '0x0000000000000000000000000000000000000000', // Staking contract
    TIMELOCK: '0x0000000000000000000000000000000000000000' // Timelock for proposals
  },
  // ERC4337 Account Abstraction
  aa: {
    bundlerUrl: 'https://bundler.roko.network',
    paymasterUrl: 'https://paymaster.roko.network',
    entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
  }
} as const;

// Performance Configuration
export const PERFORMANCE = {
  // Core Web Vitals thresholds
  thresholds: {
    fcp: 1800,    // First Contentful Paint
    lcp: 2500,    // Largest Contentful Paint
    fid: 100,     // First Input Delay
    cls: 0.1,     // Cumulative Layout Shift
    tti: 3800     // Time to Interactive
  },

  // Bundle size limits
  bundleSize: {
    warning: 500,  // KB
    error: 1000    // KB
  }
} as const;

// Feature Flags
export const FEATURES = {
  web3Integration: true,
  threeDVisualizations: true,
  governanceModule: true,
  stakingInterface: true,
  analytics: true,
  notifications: true,
  darkMode: true,
  pwa: true,
  gaslessVoting: true,
  delegationSupport: true,
  multiTokenGovernance: true,
  reputationSystem: true
} as const;

// Governance Configuration
export const GOVERNANCE_CONFIG = {
  votingPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
  minVotingPower: 1000, // Minimum pwROKO to vote
  quorumPercentage: 4, // 4% quorum required
  proposalThreshold: 10000, // pwROKO needed to create proposal
  timelockDelay: 2 * 24 * 60 * 60, // 2 days timelock
  maxActions: 10, // Max actions per proposal
  workingGroups: [
    'technical',
    'treasury',
    'community',
    'marketing',
    'security'
  ]
} as const;

// Staking Configuration
export const STAKING_CONFIG = {
  minStake: 100, // Minimum ROKO to stake
  maxStake: 1000000, // Maximum ROKO to stake
  lockPeriod: 30 * 24 * 60 * 60, // 30 days lock period
  rewardRate: 500, // 5% APY (500 basis points)
  compoundInterval: 24 * 60 * 60, // Daily compounding
  unstakePenalty: 200, // 2% penalty for early unstaking
  delegationEnabled: true
} as const;

// Environment Configuration
export const ENV = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  version: import.meta.env.VITE_VERSION || '0.1.0',
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  infuraApiKey: import.meta.env.VITE_INFURA_API_KEY || '',
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY || ''
} as const;