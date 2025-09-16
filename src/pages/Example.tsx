import React from 'react';
import { Layout } from '../components/templates/Layout';

/**
 * Example Page
 *
 * Demonstrates the Layout component with Header, Footer, and SEO features.
 * This serves as a reference implementation.
 */
const ExamplePage: React.FC = () => {
  return (
    <Layout
      title="Example Page"
      description="This is an example page demonstrating the ROKO Network layout components"
      keywords="example, demo, layout, components, roko, network"
    >
      <div style={{ padding: '2rem', minHeight: '60vh' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          color: 'var(--color-accent)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          ROKO Network Layout Demo
        </h1>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'var(--font-body)',
          lineHeight: '1.6',
          color: 'var(--text-secondary)'
        }}>
          <h2 style={{
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-display)'
          }}>
            Components Included
          </h2>

          <ul style={{ marginBottom: '2rem' }}>
            <li><strong>Header:</strong> Fixed glassmorphism header with navigation and wallet connection</li>
            <li><strong>Navigation:</strong> Responsive navigation with accessibility support</li>
            <li><strong>Footer:</strong> Four-column layout with social links and newsletter</li>
            <li><strong>Layout:</strong> Template with SEO, error boundaries, and performance monitoring</li>
          </ul>

          <h2 style={{
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-display)'
          }}>
            Features
          </h2>

          <ul style={{ marginBottom: '2rem' }}>
            <li>WCAG 2.2 AA compliant accessibility</li>
            <li>Responsive design for all screen sizes</li>
            <li>Performance optimized with Web Vitals monitoring</li>
            <li>SEO optimized with meta tags and structured data</li>
            <li>Error boundaries for graceful error handling</li>
            <li>Smooth page transitions with Framer Motion</li>
            <li>RainbowKit integration for Web3 wallet connection</li>
          </ul>

          <h2 style={{
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-display)'
          }}>
            Brand Standards
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              border: '1px solid rgba(186, 192, 204, 0.1)'
            }}>
              <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Primary</h3>
              <div style={{
                width: '100%',
                height: '40px',
                background: 'var(--color-primary)',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}></div>
              <code style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>#BAC0CC</code>
            </div>

            <div style={{
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              border: '1px solid rgba(186, 192, 204, 0.1)'
            }}>
              <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Accent</h3>
              <div style={{
                width: '100%',
                height: '40px',
                background: 'var(--color-accent)',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}></div>
              <code style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>#00d4aa</code>
            </div>

            <div style={{
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              border: '1px solid rgba(186, 192, 204, 0.1)'
            }}>
              <h3 style={{ color: 'var(--color-dark)', marginBottom: '0.5rem' }}>Dark</h3>
              <div style={{
                width: '100%',
                height: '40px',
                background: 'var(--color-dark)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                border: '1px solid rgba(186, 192, 204, 0.2)'
              }}></div>
              <code style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>#181818</code>
            </div>
          </div>

          <p style={{
            padding: '1.5rem',
            background: 'rgba(0, 212, 170, 0.1)',
            border: '1px solid rgba(0, 212, 170, 0.2)',
            borderRadius: '8px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: '600',
            color: 'var(--color-accent)'
          }}>
            Nanosecond Precision. Infinite Possibilities.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ExamplePage;