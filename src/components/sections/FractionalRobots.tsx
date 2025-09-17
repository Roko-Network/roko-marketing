import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CubeTransparentIcon,
  SparklesIcon,
  CpuChipIcon,
  ArrowTopRightOnSquareIcon,
  BeakerIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import styles from './FractionalRobots.module.css';

export const FractionalRobots: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [isEggHovered, setIsEggHovered] = useState(false);

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

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section
      ref={ref}
      className={styles.fractionalRobots}
      role="region"
      aria-label="Fractional Robots and The Egg"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Fractional Robots</span>
            <br />
            <span style={{ color: '#000000' }}>Featuring The Egg</span>
          </h2>
          <p className={styles.subtitle}>
            Meet the revolutionary maker bot creator that's transforming how we build and deploy robotic systems
          </p>
        </motion.div>

        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* The Egg Showcase */}
          <motion.div className={styles.eggShowcase} variants={itemVariants}>
            <motion.div
              className={styles.eggVisual}
              animate={isEggHovered ? "hover" : "animate"}
              variants={floatVariants}
              onHoverStart={() => setIsEggHovered(true)}
              onHoverEnd={() => setIsEggHovered(false)}
            >
              <div className={styles.eggContainer}>
                <div className={styles.egg}>
                  <SparklesIcon className={styles.eggIcon} />
                  <div className={styles.eggGlow} />
                </div>
                <div className={styles.particles}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.particle} />
                  ))}
                </div>
              </div>
            </motion.div>

            <div className={styles.eggContent}>
              <h3 className={styles.eggTitle}>The Egg</h3>
              <div className={styles.eggBadge}>Maker Bot Creator</div>
              <p className={styles.eggDescription}>
                The Egg is an advanced autonomous system that creates, trains, and deploys
                specialized robotic agents. As part of the Robit ecosystem, it serves as
                the genesis point for our distributed robotic network, spawning intelligent
                agents tailored for specific tasks and environments.
              </p>

              <div className={styles.eggFeatures}>
                <div className={styles.eggFeature}>
                  <CpuChipIcon className={styles.featureIcon} />
                  <span>Self-Replicating Architecture</span>
                </div>
                <div className={styles.eggFeature}>
                  <BeakerIcon className={styles.featureIcon} />
                  <span>Adaptive Learning Systems</span>
                </div>
                <div className={styles.eggFeature}>
                  <CommandLineIcon className={styles.featureIcon} />
                  <span>Autonomous Code Generation</span>
                </div>
              </div>

              <a
                href="https://docs.roko.network/in-development/egg"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.learnMoreLink}
              >
                Explore The Egg Documentation
                <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
              </a>
            </div>
          </motion.div>

          {/* Robit Process */}
          <motion.div className={styles.robitProcess} variants={itemVariants}>
            <h3>The Robit Creation Process</h3>
            <p className={styles.processDescription}>
              Watch as The Egg orchestrates the creation of specialized robotic agents,
              each designed with unique capabilities and purposes within the ROKO ecosystem.
            </p>

            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h4>Initialization</h4>
                <p>The Egg analyzes requirements and initializes the creation matrix</p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h4>Configuration</h4>
                <p>Neural pathways and behavioral patterns are configured for the specific task</p>
              </div>
              <div className={styles.stepConnector} />
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h4>Deployment</h4>
                <p>The new Robit is deployed to the network with full autonomous capabilities</p>
              </div>
            </div>
          </motion.div>

          {/* Fun Facts */}
          <motion.div className={styles.funFacts} variants={itemVariants}>
            <h3>Fun Facts About The Egg</h3>
            <div className={styles.factsGrid}>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🥚</div>
                <p>The Egg never sleeps - it's creating new Robits 24/7</p>
              </div>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🤖</div>
                <p>Each Robit inherits unique traits from The Egg's vast knowledge base</p>
              </div>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🧬</div>
                <p>The Egg evolves its creation patterns based on network feedback</p>
              </div>
              <div className={styles.fact}>
                <div className={styles.factEmoji}>🌟</div>
                <p>Over 1,000 unique Robit configurations have been generated to date</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div className={styles.interactiveSection} variants={itemVariants}>
            <h3>Experience The Magic</h3>
            <p className={styles.interactiveDescription}>
              The Egg represents the future of autonomous system creation - a self-sustaining
              ecosystem where intelligent agents are born, learn, and evolve to meet the
              ever-changing needs of the ROKO Network.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button
                className={styles.primaryButton}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://docs.roko.network/in-development/egg', '_blank')}
              >
                Meet The Egg
              </motion.button>
              <motion.button
                className={styles.secondaryButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://fractionalrobots.com', '_blank')}
              >
                Visit Fractional Robots
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circuitPattern} />
        <div className={styles.floatingOrbs} />
      </div>
    </section>
  );
};

export default FractionalRobots;