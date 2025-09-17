import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import styles from './Contact.module.css';

const ContactPage: React.FC = () => {
  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Company</span>
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            <span>Contact</span>
          </nav>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>Get in touch with the ROKO Network team</p>
        </header>

        <div className={styles.contentGrid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Send a Message</h2>
            <form className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input type="text" className={styles.formInput} placeholder="Your name" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input type="email" className={styles.formInput} placeholder="your@email.com" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject</label>
                <input type="text" className={styles.formInput} placeholder="How can we help?" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea className={styles.formTextarea} placeholder="Your message..." />
              </div>
              <button type="submit" className={styles.formButton}>Send Message</button>
            </form>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            <div className={styles.contactMethods}>
              <div className={styles.card}>
                <EnvelopeIcon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>General Inquiries</h3>
                <a href="mailto:hello@roko.network" className={styles.link}>hello@roko.network</a>
              </div>
              <div className={styles.card}>
                <ChatBubbleLeftRightIcon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Community</h3>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.link}>Discord</a>
                  <a href="#" className={styles.link}>Telegram</a>
                  <a href="#" className={styles.link}>Twitter</a>
                </div>
              </div>
              <div className={styles.card}>
                <MapPinIcon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Global Presence</h3>
                <p className={styles.cardDescription}>
                  Remote-first team operating globally with nodes in 50+ countries
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Response Time</h3>
          <div className={styles.infoContent}>
            We typically respond to inquiries within 24-48 hours during business days
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;