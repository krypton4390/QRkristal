import React from 'react';
import { UserPlus, Zap, Shield, Share2, Smartphone, Monitor } from 'lucide-react';

const VCardInfo = () => {
  return (
    <section className="py-24 px-6 lg:px-12 bg-white text-black overflow-hidden relative" id="vcard-info">
      {/* Subtle background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left: Visual Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full">
              <UserPlus className="w-4 h-4 text-black" />
              <span className="text-[10px] font-black uppercase tracking-widest">Digital Networking 2.0</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              What is a vCard QR Code & <span className="text-black/30">Why Your Business Needs It.</span>
            </h2>
            <p className="text-xl text-black/60 leading-relaxed max-w-xl">
              A vCard (Virtual Contact File) is the global standard for electronic business cards. When embedded in a QR code, it becomes a powerful bridge between the physical and digital world.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Instant Saving</h3>
                <p className="text-sm text-black/50 leading-relaxed">No manual typing. One scan, one click, and your details are saved directly into their contacts.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Zero Dependency</h3>
                <p className="text-sm text-black/50 leading-relaxed">vCards are static data. They don't need an internet connection or a specific app to be saved.</p>
              </div>
            </div>
          </div>

          {/* Right: How to Use Guide */}
          <div className="lg:w-1/2 bg-black text-white p-10 lg:p-16 rounded-[3rem] shadow-2xl relative">
            <div className="absolute top-10 right-10 opacity-10">
              <Smartphone className="w-32 h-32" />
            </div>
            
            <h3 className="text-3xl font-black mb-10">How to Use vCards</h3>
            
            <div className="space-y-10">
              {[
                { 
                  title: "Generate Your Code", 
                  desc: "Fill in your name, email, and social links in our vCard generator. We encode this directly into a vCard 3.0 format.",
                  icon: Monitor
                },
                { 
                  title: "Deploy Anywhere", 
                  desc: "Add your QR code to business cards, email signatures, or event presentations for seamless networking.",
                  icon: Share2
                },
                { 
                  title: "Seamless Scanning", 
                  desc: "The recipient scans the code with their camera. Their phone automatically detects the contact info and prompts 'Save Contact'.",
                  icon: Smartphone
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 font-black text-xs group-hover:bg-white group-hover:text-black transition-all">
                    {i + 1}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      {step.title}
                    </h4>
                    <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-white/10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(n => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-black bg-white/20" />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Trusted by 5,000+ Professionals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VCardInfo;
