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
                <a
                  href="mailto:hello@roko.network?subject=General%20Inquiry%20-%20ROKO%20Network&body=Hello%20ROKO%20Team%2C%0A%0AI'm%20interested%20in%20learning%20more%20about%20ROKO%20Network.%0A%0A%5BYour%20message%20here%5D%0A%0ABest%20regards%2C%0A%5BYour%20name%5D"
                  className={styles.link}
                >
                  hello@roko.network
                </a>
              </div>
              <div className={styles.card}>
                <EnvelopeIcon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Partnership Inquiries</h3>
                <a
                  href="mailto:partnerships@roko.network?subject=Partnership%20Opportunity%20with%20ROKO%20Network&body=Hello%20ROKO%20Partnerships%20Team%2C%0A%0AI'm%20interested%20in%20exploring%20a%20partnership%20opportunity%20with%20ROKO%20Network.%0A%0ACompany%3A%20%5BYour%20company%5D%0ARole%3A%20%5BYour%20role%5D%0A%0APartnership%20Details%3A%0A%5BDescribe%20your%20partnership%20proposal%5D%0A%0ABest%20regards%2C%0A%5BYour%20name%5D"
                  className={styles.link}
                >
                  partnerships@roko.network
                </a>
              </div>
              <div className={styles.card}>
                <EnvelopeIcon className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Technical Support</h3>
                <a
                  href="mailto:support@roko.network?subject=Technical%20Support%20Request&body=Hello%20ROKO%20Support%20Team%2C%0A%0AI%20need%20assistance%20with%3A%0A%0AIssue%20Description%3A%0A%5BDescribe%20your%20issue%5D%0A%0AWallet%20Address%20(if%20applicable)%3A%0A%5BYour%20wallet%20address%5D%0A%0ABest%20regards%2C%0A%5BYour%20name%5D"
                  className={styles.link}
                >
                  support@roko.network
                </a>
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