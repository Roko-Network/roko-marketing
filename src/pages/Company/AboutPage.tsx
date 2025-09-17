import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRightIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import styles from './Company.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.companyPage}>

      {/* Content */}
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Company</span>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>About</span>
          </nav>
          <h1 className={styles.title}>About ROKO Network</h1>
          <p className={styles.subtitle}>
            Building the temporal infrastructure for the next generation of blockchain applications
          </p>
        </header>

        {/* Mission Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <div className={styles.sectionContent}>
            <p>
              ROKO Network is pioneering the integration of nanosecond-precision timing into blockchain technology.
              We believe that temporal accuracy is the missing piece in creating truly scalable, fair, and efficient
              decentralized systems.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Our mission is to provide developers with the infrastructure they need to build time-sensitive
              applications that were previously impossible on traditional blockchain platforms.
            </p>
          </div>
        </section>

        {/* Values Grid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={`${styles.cardGrid} ${styles.cols2}`}>
            <div className={styles.card}>
              <GlobeAltIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Global Accessibility</h3>
              <p className={styles.cardDescription}>
                Building infrastructure that serves developers and users worldwide,
                ensuring equal access to temporal blockchain technology
              </p>
            </div>
            <div className={styles.card}>
              <ShieldCheckIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Security First</h3>
              <p className={styles.cardDescription}>
                Implementing rigorous security measures and continuous auditing
                to protect our network and its participants
              </p>
            </div>
            <div className={styles.card}>
              <LightBulbIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Innovation</h3>
              <p className={styles.cardDescription}>
                Pushing the boundaries of what's possible in blockchain technology
                through continuous research and development
              </p>
            </div>
            <div className={styles.card}>
              <UsersIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Community Driven</h3>
              <p className={styles.cardDescription}>
                Building in the open with our community, ensuring that ROKO Network
                evolves to meet real-world needs
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>1ns</h3>
            <p className={styles.statLabel}>Time Precision</p>
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>100K+</h3>
            <p className={styles.statLabel}>TPS Capacity</p>
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>50+</h3>
            <p className={styles.statLabel}>Global Nodes</p>
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>99.99%</h3>
            <p className={styles.statLabel}>Uptime Target</p>
          </div>
        </div>

        {/* Timeline */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Journey</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Q1 2024</div>
              <h3 className={styles.timelineTitle}>Foundation</h3>
              <p className={styles.timelineDescription}>
                ROKO Network founded with the vision of bringing temporal precision to blockchain
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Q2 2024</div>
              <h3 className={styles.timelineTitle}>Protocol Development</h3>
              <p className={styles.timelineDescription}>
                Core temporal consensus mechanism developed and initial testing completed
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Q3 2024</div>
              <h3 className={styles.timelineTitle}>Testnet Launch</h3>
              <p className={styles.timelineDescription}>
                Public testnet launched with developer tools and documentation
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Q4 2024</div>
              <h3 className={styles.timelineTitle}>Mainnet Preparation</h3>
              <p className={styles.timelineDescription}>
                Security audits, performance optimization, and mainnet launch preparations
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Leadership Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>👤</div>
              <h3 className={styles.teamName}>Sarah Chen</h3>
              <p className={styles.teamRole}>Chief Executive Officer</p>
              <p className={styles.teamBio}>
                Former lead architect at major blockchain protocols
              </p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>👤</div>
              <h3 className={styles.teamName}>Michael Rodriguez</h3>
              <p className={styles.teamRole}>Chief Technology Officer</p>
              <p className={styles.teamBio}>
                20+ years in distributed systems and timing protocols
              </p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>👤</div>
              <h3 className={styles.teamName}>Dr. Emily Watson</h3>
              <p className={styles.teamRole}>Head of Research</p>
              <p className={styles.teamBio}>
                PhD in Computer Science, blockchain consensus expert
              </p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamAvatar}>👤</div>
              <h3 className={styles.teamName}>David Kim</h3>
              <p className={styles.teamRole}>Head of Engineering</p>
              <p className={styles.teamBio}>
                Building scalable infrastructure for Web3 applications
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className={styles.divider} />
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Join Our Mission</h2>
          <div className={styles.sectionContent}>
            <p>
              We're always looking for talented individuals who share our vision of building
              the future of blockchain technology.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/company/careers" className={styles.formButton} style={{ textDecoration: 'none', display: 'inline-block' }}>
                View Open Positions
              </Link>
              <Link to="/developers" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Start Building on ROKO
                <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;