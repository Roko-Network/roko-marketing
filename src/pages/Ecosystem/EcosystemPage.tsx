import React from 'react';

interface EcosystemPageProps {
  section?: string;
}

const EcosystemPage: React.FC<EcosystemPageProps> = ({ section }) => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 font-display text-center">
          Ecosystem
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Discover the growing ecosystem of partners, integrations, and applications
          built on ROKO Network's temporal infrastructure.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">DeFi Protocols</h3>
            <p className="text-gray-600 mb-4">
              Temporal lending, MEV protection, and time-locked transactions.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded"></div>
                <span className="text-sm text-gray-700">TempoSwap</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded"></div>
                <span className="text-sm text-gray-700">ChronoLend</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gaming & NFTs</h3>
            <p className="text-gray-600 mb-4">
              Time-based gaming mechanics and temporal NFT collections.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded"></div>
                <span className="text-sm text-gray-700">TimeWars</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-pink-100 rounded"></div>
                <span className="text-sm text-gray-700">Temporal Arts</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Infrastructure</h3>
            <p className="text-gray-600 mb-4">
              Oracles, indexers, and tools for temporal data.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-100 rounded"></div>
                <span className="text-sm text-gray-700">TimeOracle</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded"></div>
                <span className="text-sm text-gray-700">ChronoGraph</span>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 1</span>
            </div>
            <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 2</span>
            </div>
            <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 3</span>
            </div>
            <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 4</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ecosystem Stats</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">25+</div>
              <div className="text-gray-600">Active dApps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">$15M+</div>
              <div className="text-gray-600">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">1M+</div>
              <div className="text-gray-600">Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemPage;