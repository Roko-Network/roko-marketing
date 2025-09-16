import React from 'react';

interface GovernancePageProps {
  section?: string;
}

const GovernancePage: React.FC<GovernancePageProps> = ({ section }) => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 font-display text-center">
          Governance
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Participate in the decentralized governance of ROKO Network through
          proposal voting and validator staking.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Active Proposals</h3>
            <p className="text-gray-600 mb-6">
              Vote on network upgrades, parameter changes, and community initiatives.
            </p>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Proposal #001</h4>
                <p className="text-sm text-gray-600">Network parameter adjustment</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-green-600">Status: Active</span>
                  <span className="text-gray-500">Ends in 5 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Validator Network</h3>
            <p className="text-gray-600 mb-6">
              Secure the network by staking ROKO tokens with trusted validators.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Staked</span>
                <span className="font-semibold">12.5M ROKO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Validators</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Staking Ratio</span>
                <span className="font-semibold">65.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernancePage;