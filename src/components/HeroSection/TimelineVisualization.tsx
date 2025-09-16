import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './TimelineVisualization.module.css';

interface TimelineVisualizationProps {
  animated?: boolean;
  'data-testid'?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: number;
  type: 'sync' | 'transaction' | 'consensus';
  precision: number; // in nanoseconds
}

const generateMockEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const now = Date.now();
  const types: Array<'sync' | 'transaction' | 'consensus'> = ['sync', 'transaction', 'consensus'];
  
  for (let i = 0; i < 12; i++) {
    events.push({
      id: `event-${i}`,
      timestamp: now - (i * 100) - Math.random() * 50,
      type: types[Math.floor(Math.random() * types.length)],
      precision: Math.random() * 100 + 10, // 10-110 nanoseconds
    });
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp);
};

const EventDot: React.FC<{
  event: TimelineEvent;
  index: number;
  animated: boolean;
}> = ({ event, index, animated }) => {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'sync': return 'var(--roko-teal, #00d4aa)';
      case 'transaction': return 'var(--roko-primary, #BAC0CC)';
      case 'consensus': return 'var(--roko-secondary, #BCC1D1)';
      default: return 'var(--roko-tertiary, #D9DBE3)';
    }
  };

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: animated ? index * 0.1 : 0,
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      className={styles.eventDot}
      variants={variants}
      initial="hidden"
      animate="visible"
      style={{ 
        backgroundColor: getEventColor(event.type),
        left: `${(index / 11) * 100}%`
      }}
      data-precision={`${event.precision.toFixed(0)}ns`}
      data-type={event.type}
      role="button"
      tabIndex={0}
      aria-label={`${event.type} event with ${event.precision.toFixed(0)}ns precision`}
    />
  );
};

const PrecisionIndicator: React.FC<{ precision: number }> = ({ precision }) => (
  <motion.div
    className={styles.precisionIndicator}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <span className={styles.precisionValue}>{precision.toFixed(0)}</span>
    <span className={styles.precisionUnit}>ns</span>
    <span className={styles.precisionLabel}>Average Precision</span>
  </motion.div>
);

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = memo(({ 
  animated = true,
  'data-testid': testId 
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [currentPrecision, setCurrentPrecision] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize with mock events
    const initialEvents = generateMockEvents();
    setEvents(initialEvents);
    setCurrentPrecision(initialEvents.reduce((sum, event) => sum + event.precision, 0) / initialEvents.length);

    if (animated) {
      // Update events periodically to show real-time nature
      intervalRef.current = setInterval(() => {
        const newEvents = generateMockEvents();
        setEvents(newEvents);
        setCurrentPrecision(newEvents.reduce((sum, event) => sum + event.precision, 0) / newEvents.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: animated ? 0.1 : 0,
      },
    },
  };

  return (
    <div 
      className={styles.container}
      data-testid={testId}
      role="region"
      aria-label="Timeline visualization showing network synchronization events"
    >
      <motion.div
        className={styles.timelineWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.timelineHeader}>
          <h3 className={styles.title}>Real-Time Network Synchronization</h3>
          <p className={styles.subtitle}>IEEE 1588 PTP precision timing events</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineTrack} />
          <div className={styles.timelineCursor} />
          
          {events.map((event, index) => (
            <EventDot
              key={event.id}
              event={event}
              index={index}
              animated={animated}
            />
          ))}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: 'var(--roko-teal, #00d4aa)' }} />
            <span>Clock Sync</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: 'var(--roko-primary, #BAC0CC)' }} />
            <span>Transaction</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: 'var(--roko-secondary, #BCC1D1)' }} />
            <span>Consensus</span>
          </div>
        </div>

        <PrecisionIndicator precision={currentPrecision} />
      </motion.div>
    </div>
  );
});

TimelineVisualization.displayName = 'TimelineVisualization';