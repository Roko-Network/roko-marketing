// Core application types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  label: string;
  description?: string;
  featured?: boolean;
}

// ROKO Network specific types
export interface NetworkStats {
  blockTime: number;
  transactions: number;
  validators: number;
  stakingRatio: number;
  temporalAccuracy: string;
}

export interface ValidatorInfo {
  id: string;
  name: string;
  stake: string;
  commission: number;
  uptime: number;
  temporalPrecision: string;
}

export interface ProposalInfo {
  id: string;
  title: string;
  description: string;
  type: 'parameter' | 'upgrade' | 'text';
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votingPeriod: {
    start: Date;
    end: Date;
  };
  votes: {
    yes: number;
    no: number;
    abstain: number;
    noWithVeto: number;
  };
  proposer: string;
}

// Theme and styling types
export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  dark: string;
  teal: string;
  background: {
    primary: string;
    secondary: string;
    accent: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
}

export interface Typography {
  fontFamily: {
    display: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

// Component types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  repeat?: number;
}

export interface ScrollAnimationProps {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

// Web3 integration types
export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance?: string;
}

export interface StakingInfo {
  totalStaked: string;
  rewards: string;
  unbondingPeriod: number;
  validator?: ValidatorInfo;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Error types
export interface ErrorInfo {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Performance monitoring types
export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

// 3D and visualization types
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ModelConfig {
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
  url: string;
}

export interface AnimationKeyframe {
  time: number;
  value: any;
  easing?: string;
}

export interface ParticleSystemConfig {
  count: number;
  position: Vector3D;
  velocity: Vector3D;
  color: string;
  size: number;
  opacity: number;
  lifetime: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event types
export type EventCallback<T = any> = (data: T) => void;

export interface EventEmitter {
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback: EventCallback) => void;
  emit: (event: string, data?: any) => void;
}