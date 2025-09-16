import React from 'react';

interface AccessibilityFallbackProps {
  className?: string;
  title?: string;
  description?: string;
}

export const AccessibilityFallback: React.FC<AccessibilityFallbackProps> = ({
  className = '',
  title = 'ROKO Temporal Network',
  description = 'Experience nanosecond-precision blockchain technology with global validator nodes.'
}) => {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black ${className}`}>
      <div className="text-center p-8 max-w-2xl">
        {/* Animated logo placeholder */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#BAC0CC] animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gray-900" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#BAC0CC] opacity-80" />
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h3>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{description}</p>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#00d4aa]/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#00d4aa]" />
            </div>
            <h4 className="text-white font-semibold mb-2">Nanosecond Precision</h4>
            <p className="text-gray-500 text-sm">Ultra-fast transaction processing with temporal consensus</p>
          </div>

          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#BAC0CC]/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#BAC0CC]" />
            </div>
            <h4 className="text-white font-semibold mb-2">Global Network</h4>
            <p className="text-gray-500 text-sm">Distributed validators across continents</p>
          </div>

          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#BCC1D1]/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#BCC1D1]" />
            </div>
            <h4 className="text-white font-semibold mb-2">Quantum Ready</h4>
            <p className="text-gray-500 text-sm">Future-proof cryptographic infrastructure</p>
          </div>
        </div>

        {/* Browser upgrade suggestion */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-sm">
            For the full immersive experience, try using a modern browser with WebGL support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityFallback;