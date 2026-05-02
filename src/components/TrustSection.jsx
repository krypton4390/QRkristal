import React from 'react';

const TrustSection = () => {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#050505]" id="about">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* About Us */}
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest font-bold">
            Our Mission
          </div>
          <h2 className="text-4xl font-black text-white">Engineered for Precision, Designed for Privacy</h2>
          <p className="text-white/60 leading-relaxed text-lg">
            QR Crystal was founded by a team of Computer Engineers who grew tired of "free" tools that were cluttered with ads and compromised user privacy through unnecessary tracking redirects.
          </p>
          <p className="text-white/60 leading-relaxed">
            Our mission is to provide the world's most reliable, high-fidelity QR generation engine. With a background in systems architecture and data security, we built QR Crystal from the ground up to prioritize two things: technical excellence and absolute data integrity. We don't just provide a tool; we provide a professional-grade utility that engineers and designers can trust for their most critical projects.
          </p>
        </div>

        {/* Privacy & Security */}
        <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 20.944a11.955 11.955 0 01-8.618-3.04 11.952 11.952 0 00-1.2-4.935M12 20.944a11.955 11.955 0 008.618-3.04c.43-.46.79-.98 1.058-1.547M12 2.944a11.952 11.952 0 00-1.2 4.935M12 2.944a11.955 11.955 0 018.618 3.04" />
              </svg>
              Zero-Tracking Guarantee
            </h3>
            <p className="text-white/50 leading-relaxed">
              At QR Crystal, we believe your data belongs to you. Unlike other generators that act as a "middleman" by tracking every scan, our <strong>Static QR Codes</strong> link directly to your destination.
            </p>
            <p className="text-white/50 leading-relaxed">
              We do not store, monitor, or sell the data contained within your QR codes. Our servers act purely as a generation engine, ensuring that your users' privacy is never compromised by third-party analytics scripts during the scanning process.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Encrypted</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">Free</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
