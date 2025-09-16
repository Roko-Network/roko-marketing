import React from 'react';

interface TechnologyPageProps {
  section?: string;
}

const TechnologyPage: React.FC<TechnologyPageProps> = ({ section }) => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 font-display text-center">
          Technology
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          ROKO Network introduces temporal synchronization to blockchain technology,
          enabling unprecedented precision in time-sensitive applications.
        </p>

        {section === 'temporal-layer' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Temporal Layer</h2>
            <p className="text-gray-600 mb-4">
              Our temporal layer provides nanosecond-precision timestamps using IEEE 1588 PTP protocol.
            </p>
          </section>
        )}

        {section === 'consensus' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Consensus Mechanism</h2>
            <p className="text-gray-600 mb-4">
              Temporal Proof of Stake (TPoS) ensures both security and temporal accuracy.
            </p>
          </section>
        )}

        {!section && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Temporal Layer</h3>
              <p className="text-gray-600 mb-4">
                IEEE 1588 PTP-grade synchronization for nanosecond precision.
              </p>
              <a href="/technology/temporal-layer" className="text-teal-600 hover:text-teal-700">
                Learn more →
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consensus</h3>
              <p className="text-gray-600 mb-4">
                Temporal Proof of Stake for secure and time-aware validation.
              </p>
              <a href="/technology/consensus" className="text-teal-600 hover:text-teal-700">
                Learn more →
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Architecture</h3>
              <p className="text-gray-600 mb-4">
                Scalable infrastructure designed for time-sensitive applications.
              </p>
              <a href="/technology/architecture" className="text-teal-600 hover:text-teal-700">
                Learn more →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnologyPage;