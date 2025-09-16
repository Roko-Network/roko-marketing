import React, { memo } from 'react';
import { motion } from 'framer-motion';
import styles from './CTAButtons.module.css';

interface CTAButtonsProps {
  onNavigate: (path: string) => void;
}

const Button: React.FC<{
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick: () => void;
  icon?: string;
}> = ({ variant, children, onClick, icon }) => {
  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: variant === 'primary' 
        ? '0 8px 32px rgba(0, 212, 170, 0.3)'
        : '0 8px 32px rgba(186, 192, 204, 0.2)',
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    tap: {
      scale: 0.98,
      transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
  };

  return (
    <motion.button
      className={`${styles.button} ${styles[variant]}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      type="button"
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};

export const CTAButtons: React.FC<CTAButtonsProps> = memo(({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.buttonGroup} variants={itemVariants}>
        <Button
          variant="primary"
          onClick={() => onNavigate('/docs')}
          icon="🚀"
        >
          Start Building
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => onNavigate('/technology')}
          icon="⚡"
        >
          Learn More
        </Button>
      </motion.div>

      <motion.div className={styles.additionalActions} variants={itemVariants}>
        <button
          className={styles.linkButton}
          onClick={() => onNavigate('/governance')}
          type="button"
        >
          <span className={styles.linkIcon}>🏛️</span>
          Join DAO Governance
        </button>
        
        <button
          className={styles.linkButton}
          onClick={() => onNavigate('/staking')}
          type="button"
        >
          <span className={styles.linkIcon}>💎</span>
          Stake pwROKO
        </button>
      </motion.div>
    </motion.div>
  );
});

CTAButtons.displayName = 'CTAButtons';