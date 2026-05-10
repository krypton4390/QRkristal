import React, { useState, Suspense, lazy, useEffect } from 'react';
import QRCodePreview from './components/QRCodePreview';
import CustomizationPanel from './components/CustomizationPanel';
import FAQSection from './components/FAQSection';
import TrustSection from './components/TrustSection';
import ContentPillar from './components/ContentPillar';
import VCardGenerator from './components/VCardGenerator';
import VCardInfo from './components/VCardInfo';
const BulkGenerator = lazy(() => import('./components/BulkGenerator'));

function App() {
  const [mode, setMode] = useState('single'); // 'single', 'bulk', or 'vcard'
  const [url, setUrl] = useState('https://qrcrystal.xyz/');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [qrStyle, setQrStyle] = useState('rounded');

  useEffect(() => {
    // Mode-specific side effects can go here
  }, [mode]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-white selection:text-black scroll-smooth">
      <div className="flex flex-col lg:flex-row lg:h-screen w-full overflow-hidden shrink-0">
        {/* Main Content Area */}
        <main className={`flex-1 relative flex flex-col items-center ${mode === 'vcard' ? 'justify-start overflow-y-auto' : 'justify-center overflow-hidden'} p-6 lg:p-12 pt-40 sm:pt-48 lg:pt-24 min-h-[100dvh] lg:min-h-0`}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            <div className="absolute top-[30%] left-[20%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            <div className="absolute top-[40%] right-[30%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          </div>

          {/* Top Navigation / Brand */}
          <div className="absolute top-8 left-0 right-0 lg:left-12 lg:right-auto flex flex-col lg:flex-row items-center lg:items-center gap-6 lg:gap-12 z-50 px-6 lg:px-0">
            <div className="flex items-center space-x-4">
              <img src="/favicon.png" alt="QR Crystal Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] object-contain" />
              <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">QR Code Generator</h1>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mt-1">by QR Crystal — Free Online Tool</p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['single', 'bulk', 'vcard'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${mode === m ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  {m === 'vcard' ? 'vCard' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {mode === 'single' && (
            <QRCodePreview 
              url={url} 
              fgColor={fgColor} 
              bgColor={bgColor} 
              logo={logo} 
              qrStyle={qrStyle}
            />
          )}
          {mode === 'bulk' && (
            <Suspense fallback={<div className="text-white/30 text-sm font-bold uppercase tracking-widest animate-pulse">Loading Bulk Generator...</div>}>
              <BulkGenerator />
            </Suspense>
          )}
          {mode === 'vcard' && (
            <Suspense fallback={<div className="text-white/30 text-sm font-bold uppercase tracking-widest animate-pulse">Loading vCard Generator...</div>}>
              <VCardGenerator />
            </Suspense>
          )}


          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 flex flex-col items-center space-y-4 animate-bounce opacity-20 hover:opacity-100 transition-opacity cursor-pointer z-10" onClick={() => document.getElementById('content-start').scrollIntoView()}>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Explore Features</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
          </div>
        </main>

        {/* Side Customization Drawer (Only for Single mode) */}
        {mode === 'single' && (
          <CustomizationPanel 
            url={url} setUrl={setUrl}
            fgColor={fgColor} setFgColor={setFgColor}
            bgColor={bgColor} setBgColor={setBgColor}
            logo={logo} setLogo={setLogo}
            qrStyle={qrStyle} setQrStyle={setQrStyle}
          />
        )}
      </div>

      {/* SEO & Content Sections */}
      <div id="content-start">
        {/* How-To Section — targets "how to create qr code" queries */}
        <section className="py-24 px-6 lg:px-12 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white">How to Create a QR Code for Free</h2>
            <p className="text-white/50 text-lg mb-12 max-w-2xl">Generate custom QR codes in seconds with QR Crystal. No signup, no ads, no tracking. Here's how:</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Enter Your URL or Text', desc: 'Paste any link, WiFi credentials, vCard, or plain text into the QR code generator input field.' },
                { step: '02', title: 'Customize Your Design', desc: 'Pick custom colors, upload your brand logo, and choose between classic or organic dot patterns.' },
                { step: '03', title: 'Download for Free', desc: 'Export your QR code in PNG, JPEG, or SVG format. Perfect for print, web, or digital marketing.' }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all space-y-4">
                  <span className="text-5xl font-black text-white/10">{item.step}</span>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <VCardInfo />
        <ContentPillar />
        <FAQSection />
        <TrustSection />
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/20">
        <p className="text-xs uppercase tracking-[0.2em] font-bold">&copy; 2026 QR Crystal • Engineered for the Future</p>
      </footer>
    </div>
  );
}

export default App;
