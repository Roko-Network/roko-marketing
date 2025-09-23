import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRightIcon,
  NewspaperIcon,
  DocumentTextIcon,
  PhotoIcon,
  MegaphoneIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import styles from './Company.module.css';

const PressPage: React.FC = () => {
  const pressReleases = [
    {
      id: '2024-q3-launch',
      date: 'October 15, 2024',
      title: 'ROKO Network Announces Testnet Launch with Nanosecond Precision',
      summary: 'Novel temporal blockchain infrastructure goes live for developer testing'
    },
    {
      id: '2024-funding',
      date: 'September 1, 2024',
      title: 'ROKO Network Secures Strategic Partnerships',
      summary: 'Leading blockchain infrastructure providers join ROKO ecosystem'
    },
    {
      id: '2024-whitepaper',
      date: 'July 20, 2024',
      title: 'ROKO Network Releases Technical Whitepaper',
      summary: 'Detailed technical specifications for temporal consensus mechanism published'
    }
  ];

  const mediaAssets = [
    {
      icon: PhotoIcon,
      title: 'Logo Package',
      description: 'High-resolution logos in various formats',
      size: '2.3 MB'
    },
    {
      icon: DocumentTextIcon,
      title: 'Brand Guidelines',
      description: 'Complete brand usage guidelines and color specifications',
      size: '4.1 MB'
    },
    {
      icon: NewspaperIcon,
      title: 'Fact Sheet',
      description: 'Key facts and figures about ROKO Network',
      size: '156 KB'
    },
    {
      icon: MegaphoneIcon,
      title: 'Executive Bios',
      description: 'Leadership team biographies and headshots',
      size: '892 KB'
    }
  ];

  const coverage = [
    {
      outlet: 'CoinDesk',
      title: 'ROKO Network Brings Nanosecond Timing to Blockchain',
      date: 'October 2024'
    },
    {
      outlet: 'The Block',
      title: 'Temporal Consensus: The Next Evolution in Blockchain?',
      date: 'September 2024'
    },
    {
      outlet: 'Decrypt',
      title: 'How ROKO Network Plans to Solve MEV with Time',
      date: 'August 2024'
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
            <span>Press</span>
          </nav>
          <h1 className={styles.title}>Press Center</h1>
          <p className={styles.subtitle}>
            Media resources, press releases, and news coverage
          </p>
        </header>

        {/* Latest Press Releases */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Latest Press Releases</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pressReleases.map(release => (
              <div key={release.id} className={styles.card}>
                <div className={styles.timelineDate} style={{ marginBottom: '0.5rem' }}>
                  {release.date}
                </div>
                <h3 className={styles.cardTitle}>{release.title}</h3>
                <p className={styles.cardDescription}>{release.summary}</p>
                <a href="#" className={styles.link} style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Read Full Release
                  <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Media Kit</h2>
          <p className={styles.sectionContent} style={{ marginBottom: '2rem' }}>
            Download our media assets for use in articles and publications
          </p>
          <div className={`${styles.cardGrid} ${styles.cols2}`}>
            {mediaAssets.map(asset => (
              <div key={asset.title} className={styles.card} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <asset.icon className={styles.cardIcon} style={{ margin: 0, width: '2rem', height: '2rem' }} />
                    <div>
                      <h3 className={styles.cardTitle} style={{ margin: 0, fontSize: '1.1rem' }}>{asset.title}</h3>
                      <p className={styles.cardDescription} style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                        {asset.description}
                      </p>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', opacity: '0.7' }}>{asset.size}</span>
                    </div>
                  </div>
                  <ArrowDownTrayIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--text-primary)', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>In the News</h2>
          <div className={styles.list}>
            {coverage.map((article, index) => (
              <div key={index} className={styles.listItem} style={{ paddingLeft: 0, marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {article.title}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', opacity: '0.7', fontSize: '0.9rem' }}>
                      {article.outlet} • {article.date}
                    </p>
                  </div>
                  <a href="#" className={styles.link}>Read Article →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Press Inquiries</h3>
          <div className={styles.infoContent}>
            <p>For media inquiries, interview requests, or additional information:</p>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Email:</strong> <a href="mailto:press@roko.network" className={styles.link}>press@roko.network</a>
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Press Kit:</strong> <a href="#" className={styles.link}>Download Full Press Kit (ZIP)</a>
              </p>
            </div>
          </div>
        </div>

        {/* Spokesperson */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spokesperson Availability</h2>
          <div className={styles.sectionContent}>
            <p>
              Our executive team and technical experts are available for interviews,
              podcasts, and speaking engagements on topics including:
            </p>
            <ul className={styles.list} style={{ marginTop: '1rem' }}>
              <li className={styles.listItem}>Temporal blockchain technology and nanosecond precision</li>
              <li className={styles.listItem}>The future of DeFi and time-sensitive applications</li>
              <li className={styles.listItem}>MEV mitigation through temporal consensus</li>
              <li className={styles.listItem}>Building scalable Web3 infrastructure</li>
              <li className={styles.listItem}>Blockchain governance and decentralization</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PressPage;