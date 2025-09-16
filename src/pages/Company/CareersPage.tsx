import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRightIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import styles from './Company.module.css';

const CareersPage: React.FC = () => {
  const openPositions = [
    {
      id: 'senior-blockchain',
      title: 'Senior Blockchain Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build core temporal consensus mechanisms and smart contract infrastructure'
    },
    {
      id: 'frontend-lead',
      title: 'Frontend Lead Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead the development of user interfaces for ROKO Network applications'
    },
    {
      id: 'defi-architect',
      title: 'DeFi Protocol Architect',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design and implement time-sensitive DeFi protocols on ROKO Network'
    },
    {
      id: 'community-manager',
      title: 'Community Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and engage our global developer and user community'
    },
    {
      id: 'security-engineer',
      title: 'Security Engineer',
      department: 'Security',
      location: 'Remote',
      type: 'Full-time',
      description: 'Ensure the security of ROKO Network through audits and monitoring'
    },
    {
      id: 'devrel',
      title: 'Developer Relations Engineer',
      department: 'Developer Experience',
      location: 'Remote',
      type: 'Full-time',
      description: 'Support developers building on ROKO Network with documentation and tools'
    }
  ];

  const benefits = [
    {
      icon: GlobeAltIcon,
      title: 'Remote-First',
      description: 'Work from anywhere in the world with flexible hours'
    },
    {
      icon: UserGroupIcon,
      title: 'Token Allocation',
      description: 'Participate in the network with team token grants'
    },
    {
      icon: BriefcaseIcon,
      title: 'Competitive Compensation',
      description: 'Industry-leading salary and benefits package'
    },
    {
      icon: CodeBracketIcon,
      title: 'Learning & Development',
      description: 'Conference attendance, courses, and continuous learning'
    }
  ];

  return (
    <div className={styles.companyPage}>
      {/* Background Elements */}
      <div className={styles.backgroundGradient} />
      <div className={styles.gridOverlay} />
      <div className={`${styles.accentGlow} ${styles.top}`} />
      <div className={`${styles.accentGlow} ${styles.bottom}`} />

      {/* Content */}
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Company</span>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Careers</span>
          </nav>
          <h1 className={styles.title}>Join Our Team</h1>
          <p className={styles.subtitle}>
            Help us build the future of temporal blockchain technology
          </p>
        </header>

        {/* Why Join Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why ROKO Network?</h2>
          <div className={styles.sectionContent}>
            <p>
              At ROKO Network, we're not just building another blockchain – we're creating the
              temporal infrastructure that will power the next generation of Web3 applications.
              Join a team of passionate innovators working on cutting-edge technology.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Benefits & Perks</h2>
          <div className={`${styles.cardGrid} ${styles.cols2}`}>
            {benefits.map(benefit => (
              <div key={benefit.title} className={styles.card}>
                <benefit.icon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Positions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {openPositions.map(position => (
              <div key={position.id} className={styles.card} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 className={styles.cardTitle}>{position.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#00d4aa', fontSize: '0.9rem' }}>{position.department}</span>
                      <span style={{ color: '#D9DBE3', fontSize: '0.9rem' }}>•</span>
                      <span style={{ color: '#D9DBE3', fontSize: '0.9rem' }}>{position.location}</span>
                      <span style={{ color: '#D9DBE3', fontSize: '0.9rem' }}>•</span>
                      <span style={{ color: '#D9DBE3', fontSize: '0.9rem' }}>{position.type}</span>
                    </div>
                    <p className={styles.cardDescription}>{position.description}</p>
                  </div>
                  <ChevronRightIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Culture Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Culture</h2>
          <div className={styles.sectionContent}>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Innovation First:</strong> We encourage experimentation and learning from failures
              </li>
              <li className={styles.listItem}>
                <strong>Transparency:</strong> Open communication and shared knowledge across the team
              </li>
              <li className={styles.listItem}>
                <strong>Ownership:</strong> Take responsibility for your work and its impact
              </li>
              <li className={styles.listItem}>
                <strong>Diversity:</strong> We value different perspectives and backgrounds
              </li>
              <li className={styles.listItem}>
                <strong>Work-Life Balance:</strong> Flexible schedules and unlimited PTO
              </li>
            </ul>
          </div>
        </section>

        {/* Application Process */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Application Process</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Step 1</div>
              <h3 className={styles.timelineTitle}>Application Review</h3>
              <p className={styles.timelineDescription}>
                We review your application and portfolio within 48 hours
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Step 2</div>
              <h3 className={styles.timelineTitle}>Technical Interview</h3>
              <p className={styles.timelineDescription}>
                Discussion with our engineering team about your experience
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Step 3</div>
              <h3 className={styles.timelineTitle}>Team Interview</h3>
              <p className={styles.timelineDescription}>
                Meet potential teammates and learn about our culture
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Step 4</div>
              <h3 className={styles.timelineTitle}>Offer</h3>
              <p className={styles.timelineDescription}>
                We make a decision within 24 hours of final interview
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className={styles.divider} />
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Don't See Your Role?</h2>
          <div className={styles.sectionContent}>
            <p>
              We're always looking for exceptional talent. Send us your resume and tell us
              how you can contribute to ROKO Network's mission.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <a
                href="mailto:careers@roko.network"
                className={styles.formButton}
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                Send Your Application
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareersPage;