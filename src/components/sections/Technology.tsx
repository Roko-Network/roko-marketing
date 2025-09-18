import { FC, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import {
  ClockIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CodeBracketIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { NetworkGlobe } from '../3d/NetworkGlobe';
import { AccessibilityFallback } from '../3d/AccessibilityFallback';
import styles from './Technology.module.css';

interface TechMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'stable' | 'down';
  color: string;
}

interface ComparisonRow {
  feature: string;
  traditional: string;
  roko: string;
  highlight?: boolean;
}

const techMetrics: TechMetric[] = [
  {
    id: 'precision',
    label: 'Timing Precision',
    value: '~1ns',
    description: 'IEEE 1588 PTP synchronization accuracy',
    icon: ClockIcon,
    trend: 'up',
    color: '#00d4aa'
  },
  {
    id: 'throughput',
    label: 'Transaction Throughput',
    value: '50k TPS',
    description: 'Peak transactions per second',
    icon: BoltIcon,
    trend: 'up',
    color: '#00d4aa'
  },
  {
    id: 'finality',
    label: 'Finality Time',
    value: '<100ms',
    description: 'Time to transaction finality',
    icon: ArrowTrendingUpIcon,
    trend: 'stable',
    color: '#BAC0CC'
  },
  {
    id: 'validators',
    label: 'Active Validators',
    value: '1,247',
    description: 'Global temporal validators',
    icon: ShieldCheckIcon,
    trend: 'up',
    color: '#00d4aa'
  },
  {
    id: 'uptime',
    label: 'Network Uptime',
    value: '99.97%',
    description: 'Historical availability',
    icon: GlobeAltIcon,
    trend: 'stable',
    color: '#BAC0CC'
  },
  {
    id: 'apis',
    label: 'API Calls/Day',
    value: '2.3M',
    description: 'Developer API usage',
    icon: CodeBracketIcon,
    trend: 'up',
    color: '#00d4aa'
  }
];

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Timing Precision',
    traditional: '~100ms',
    roko: '~1ns',
    highlight: true
  },
  {
    feature: 'Consensus Algorithm',
    traditional: 'Proof of Work/Stake',
    roko: 'Temporal Proof of Stake'
  },
  {
    feature: 'Synchronization',
    traditional: 'None',
    roko: 'IEEE 1588 PTP',
    highlight: true
  },
  {
    feature: 'Transaction Finality',
    traditional: '10-60 minutes',
    roko: '<100ms',
    highlight: true
  },
  {
    feature: 'Energy Efficiency',
    traditional: 'High consumption',
    roko: '99.9% less energy'
  },
  {
    feature: 'Real-time Applications',
    traditional: 'Limited support',
    roko: 'Native support',
    highlight: true
  }
];

const codeExample = `// ROKO Temporal Transaction Signing Example
import { TemporalClient, CheckTemporal } from '@roko/sdk';
import { blake2AsU8a } from '@polkadot/util-crypto';

// 1. Initialize temporal client with TimeRPC service
const client = new TemporalClient({
  timeRpcEndpoint: 'wss://timerpc.roko.network',
  network: 'mainnet'
});

// 2. Get temporal attestation for transaction
const getTemporalAttestation = async (who, call) => {
  // Fetch current timestamp and active keys
  const { timestamp, activeKeys } = await client.getTemporalInfo();
  const keyId = activeKeys[0]; // Use first active TimeRPC key

  // Build domain-separated message for signing
  const domainTag = 'TEMPORAL_ATTESTATION_V1';
  const callHash = blake2AsU8a(call.toU8a());
  const message = concat([
    stringToU8a(domainTag),
    who.toU8a(),
    callHash,
    u64ToU8a(timestamp),
    // Optional: blake2AsU8a(temporalProof)
  ]);

  // Get TimeRPC signature
  const signature = await client.signTemporal({
    keyId,
    message: blake2AsU8a(message),
    timestamp
  });

  return {
    nanoTimestamp: timestamp,
    timerpcSignature: signature,
    timerpcKeyId: keyId,
    temporalProof: new Uint8Array(0) // Optional proof bytes
  };
};

// 3. Build extrinsic with temporal SignedExtra
const submitTemporalTransaction = async (call, sender) => {
  const attestation = await getTemporalAttestation(sender, call);

  const extrinsic = api.tx[call.section][call.method](...call.args)
    .signAndSend(sender, {
      signedExtensions: {
        CheckTemporal: attestation
      }
    });

  return extrinsic;
};

// 4. Validate before submission (preflight check)
const validateTemporal = async (attestation) => {
  return await client.rpc.temporal.validateTransaction(
    attestation.nanoTimestamp,
    attestation.timerpcKeyId,
    attestation.timerpcSignature,
    attestation.message
  );
};`;

export const Technology: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'api'>('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const tabVariants = {
    inactive: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      borderRadius: 'unset'
    },
    active: {
      backgroundColor: '#f0f0f0',
      color: '#000000',
      borderRadius: 'unset'

    }
  };

  return (
    <section
      ref={ref}
      className={styles.technology}
      role="region"
      aria-label="ROKO Network technology overview"
    >
      <div className={styles.container}>
 <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Expand your toolkit</span>
          </h2>
          <p className={styles.subtitle}>
            Soon* ready for integration with your mission critical workflows through our API.
          </p>
        </motion.div>
        {/* Technology Deep Dive */}
        <motion.div
          className={styles.deepDive}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            {[
              { id: 'overview', label: 'Architecture Overview' },
              { id: 'comparison', label: 'vs Traditional Blockchains' },
              { id: 'api', label: 'Developer API' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={styles.tab}
                variants={tabVariants}
                animate={activeTab === tab.id ? 'active' : 'inactive'}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <motion.div
                className={styles.overviewContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 style={{ color: '#000000' }}>Temporal Blockchain Architecture</h4>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>1</div>
                    <div className={styles.timelineContent}>
                      <h5>Precision Time Protocol (PTP)</h5>
                      <p>IEEE 1588 hardware synchronization provides measurement accuracy across global validators.</p>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>2</div>
                    <div className={styles.timelineContent}>
                      <h5>Temporal Consensus</h5>
                      <p>Validators reach consensus using time-based ordering and temporal proofs.</p>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>3</div>
                    <div className={styles.timelineContent}>
                      <h5>Execution Layer</h5>
                      <p>Smart contracts execute with precise timing guarantees and temporal scheduling.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <motion.div
                className={styles.comparisonContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 style={{ color: '#000000' }}>ROKO vs Traditional Blockchains</h4>
                <div className={styles.comparisonTable}>
                  <div className={styles.tableHeader}>
                    <div>Feature</div>
                    <div>Traditional</div>
                    <div>ROKO Network</div>
                  </div>
                  {comparisonData.map((row, index) => (
                    <div
                      key={index}
                      className={`${styles.tableRow} ${row.highlight ? styles.highlighted : ''}`}
                    >
                      <div className={styles.feature}>{row.feature}</div>
                      <div className={styles.traditional}>{row.traditional}</div>
                      <div className={styles.roko}>{row.roko}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                className={styles.apiContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 style={{ color: '#000000' }}>Developer API Example</h4>
                <div className={styles.codeBlock}>
                  <pre><code>{codeExample}</code></pre>
                </div>
                <div className={styles.apiFeatures}>
                  <div className={styles.apiFeature}>
                    <h5>Temporal SignedExtension</h5>
                    <p>CheckTemporal carries TimeRPC attestations in extrinsic SignedExtra for nanosecond ordering</p>
                  </div>
                  <div className={styles.apiFeature}>
                    <h5>Domain-Separated Signing</h5>
                    <p>TEMPORAL_ATTESTATION_V1 domain tag ensures secure message signing over call+timestamp</p>
                  </div>
                  <div className={styles.apiFeature}>
                    <h5>Watermark Validation</h5>
                    <p>Global and in-block watermarks enforce strict temporal ordering and prevent reordering</p>
                  </div>
                  <div className={styles.apiFeature}>
                    <h5>Clock Deviation Bounds</h5>
                    <p>TimeRPC key policies validate clock synchronization within configured deviation limits</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridOverlay} />
        <div className={styles.glowEffect} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
};

export default Technology;