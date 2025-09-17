import { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Footer.module.css';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  href: string;
  icon: string;
  label: string;
}

export interface FooterProps {
  className?: string;
}

/**
 * Footer Component
 *
 * Four-column layout with product links, developer resources, community info,
 * and company information. Includes newsletter subscription and social media links.
 */
export const Footer: FC<FooterProps> = memo(({ className }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Footer navigation sections
  const footerSections: FooterSection[] = [
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: 'https://docs.roko.network/', external: true, description: 'Technical documentation and guides' },
        { label: 'DAO Governance', href: 'https://snapshot.org/#/rokonetwork.eth', external: true, description: 'Participate in ROKO Network governance' },
        { label: 'Get ROKO Tokens', href: 'https://app.uniswap.org/explore/tokens/ethereum/0x6f222e04f6c53cc688ffb0abe7206aac66a8ff98', external: true, description: 'Buy ROKO tokens on Uniswap' }
      ]
    }
  ];

  // Social media links
  const socialLinks: SocialLink[] = [
    {
      platform: 'twitter',
      href: 'https://twitter.com/rokonetwork',
      icon: '𝕏',
      label: 'Follow ROKO Network on Twitter'
    },
    {
      platform: 'discord',
      href: 'https://discord.gg/rokonetwork',
      icon: '💬',
      label: 'Join ROKO Network Discord'
    },
    {
      platform: 'telegram',
      href: 'https://t.me/rokonetwork',
      icon: '✈️',
      label: 'Join ROKO Network Telegram'
    },
    {
      platform: 'github',
      href: 'https://github.com/rokonetwork',
      icon: '🐙',
      label: 'ROKO Network on GitHub'
    },
    {
      platform: 'docs',
      href: 'https://docs.roko.network/',
      icon: '📚',
      label: 'ROKO Network Documentation'
    },
    {
      platform: 'medium',
      href: 'https://medium.com/@rokonetwork',
      icon: '📝',
      label: 'Read ROKO Network on Medium'
    }
  ];

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error');
      return;
    }

    setIsSubscribing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically make an API call to your newsletter service
      console.log('Newsletter subscription:', email);

      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }

    // Reset status after 3 seconds
    setTimeout(() => setSubscriptionStatus('idle'), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <footer className={clsx(styles.footer, className)} role="contentinfo">
      <div className={styles.container}>
        {/* Main footer content */}
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Brand section */}
          <motion.div className={styles.brandSection} variants={sectionVariants}>
            <Link to="/" className={styles.brandLink} aria-label="ROKO Network - Home">
              <div className={styles.brandLogo}>
                <span className={styles.brandName}>ROKO</span>
                <span className={styles.brandSubtext}>Network</span>
              </div>
            </Link>

            <p className={styles.brandDescription}>
              The Temporal Layer for Web3
              <br />
              <span className={styles.precisionTagline}>
                Hardware timing measurement. Infinite Possibilities.
              </span>
            </p>

            {/* Newsletter subscription */}
            <div className={styles.newsletter}>
              <h3 className={styles.newsletterTitle}>Stay Updated</h3>
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="newsletter-email" className={styles.srOnly}>
                    Email address for newsletter
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={clsx(styles.emailInput, {
                      [styles.inputError]: subscriptionStatus === 'error'
                    })}
                    disabled={isSubscribing}
                    aria-describedby="newsletter-status"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing || !email}
                    className={styles.subscribeButton}
                    aria-label="Subscribe to newsletter"
                  >
                    {isSubscribing ? (
                      <span className={styles.spinner} aria-hidden="true" />
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                <div
                  id="newsletter-status"
                  className={styles.subscriptionStatus}
                  role="status"
                  aria-live="polite"
                >
                  {subscriptionStatus === 'success' && (
                    <span className={styles.successMessage}>
                      ✓ Successfully subscribed!
                    </span>
                  )}
                  {subscriptionStatus === 'error' && (
                    <span className={styles.errorMessage}>
                      ✗ Please enter a valid email address
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Social links */}
            <div className={styles.socialLinks}>
              <h3 className={styles.socialTitle}>Connect With Us</h3>
              <div className={styles.socialGrid}>
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation sections */}
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              className={styles.navSection}
              variants={sectionVariants}
            >
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <ul className={styles.linkList}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                        aria-describedby={link.description ? `${link.href.replace(/[^a-zA-Z0-9]/g, '')}-desc` : undefined}
                      >
                        {link.label}
                        <span className={styles.externalIcon} aria-label="Opens in new tab">
                          ↗
                        </span>
                        {link.description && (
                          <span
                            id={`${link.href.replace(/[^a-zA-Z0-9]/g, '')}-desc`}
                            className={styles.srOnly}
                          >
                            {link.description}
                          </span>
                        )}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={styles.footerLink}
                        aria-describedby={link.description ? `${link.href.replace(/[^a-zA-Z0-9]/g, '')}-desc` : undefined}
                      >
                        {link.label}
                        {link.description && (
                          <span
                            id={`${link.href.replace(/[^a-zA-Z0-9]/g, '')}-desc`}
                            className={styles.srOnly}
                          >
                            {link.description}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className={styles.bottom}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className={styles.bottomContent}>
            <div className={styles.legal}>
              <p className={styles.copyright}>
                © {new Date().getFullYear()} ROKO Network. All rights reserved.
              </p>
              <div className={styles.legalLinks}>
                <Link to="/privacy" className={styles.legalLink}>
                  Privacy Policy
                </Link>
                <Link to="/terms" className={styles.legalLink}>
                  Terms of Service
                </Link>
                <Link to="/cookies" className={styles.legalLink}>
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className={styles.buildInfo}>
              <p className={styles.buildText}>
                Built with hardware-grade timing infrastructure for the temporal Web3 era
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';