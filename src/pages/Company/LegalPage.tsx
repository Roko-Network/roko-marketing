import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ShieldCheckIcon, DocumentTextIcon, ScaleIcon } from '@heroicons/react/24/outline';
import styles from './Legal.module.css';

const LegalPage: React.FC = () => {
  return (
    <div className={styles.legalPage}>

      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Company</span>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Legal</span>
          </nav>
          <h1 className={styles.title}>Legal & Privacy</h1>
          <p className={styles.subtitle}>Terms of service, privacy policy, and compliance</p>
        </header>

        <section className={styles.section}>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <DocumentTextIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Terms of Service</h3>
              <p className={styles.cardDescription}>
                Terms and conditions for using ROKO Network services
              </p>
              <a href="#" className={styles.link}>View Terms →</a>
            </div>
            <div className={styles.card}>
              <ShieldCheckIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Privacy Policy</h3>
              <p className={styles.cardDescription}>
                How we collect, use, and protect your information
              </p>
              <a href="#" className={styles.link}>View Policy →</a>
            </div>
            <div className={styles.card}>
              <ScaleIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Compliance</h3>
              <p className={styles.cardDescription}>
                Regulatory compliance and legal framework
              </p>
              <a href="#" className={styles.link}>Learn More →</a>
            </div>
            <div className={styles.card}>
              <DocumentTextIcon className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Cookie Policy</h3>
              <p className={styles.cardDescription}>
                Information about cookies and tracking technologies
              </p>
              <a href="#" className={styles.link}>View Policy →</a>
            </div>
          </div>
        </section>

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Legal Contact</h3>
          <div className={styles.infoContent}>
            For legal inquiries: <a href="mailto:legal@roko.network" className={styles.link}>legal@roko.network</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;