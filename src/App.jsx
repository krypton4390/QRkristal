import React, { useState } from 'react';
import QRCodePreview from './components/QRCodePreview';
import CustomizationPanel from './components/CustomizationPanel';
import FAQSection from './components/FAQSection';
import TrustSection from './components/TrustSection';
import ContentPillar from './components/ContentPillar';

function App() {
  const [url, setUrl] = useState('https://google.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [qrStyle, setQrStyle] = useState('rounded');

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-white selection:text-black scroll-smooth">
      <div className="flex flex-col lg:flex-row lg:h-screen w-full overflow-hidden shrink-0">
        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 min-h-[100dvh] lg:min-h-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            <div className="absolute top-[30%] left-[20%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            <div className="absolute top-[40%] right-[30%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          </div>

          {/* Top Navigation / Brand */}
          <div className="absolute top-6 left-6 lg:top-10 lg:left-12 flex items-center space-x-4 z-10">
            <img src="/favicon.png" alt="QR Crystal Logo" className="w-12 h-12 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] object-contain" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">QR Crystal</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold -mt-1">Premium Generator</p>
            </div>
          </div>

          <QRCodePreview 
            url={url} 
            fgColor={fgColor} 
            bgColor={bgColor} 
            logo={logo} 
            qrStyle={qrStyle}
          />


          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 flex flex-col items-center space-y-4 animate-bounce opacity-20 hover:opacity-100 transition-opacity cursor-pointer z-10" onClick={() => document.getElementById('content-start').scrollIntoView()}>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Explore Features</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
          </div>
        </main>

        {/* Side Customization Drawer */}
        <CustomizationPanel 
          url={url} setUrl={setUrl}
          fgColor={fgColor} setFgColor={setFgColor}
          bgColor={bgColor} setBgColor={setBgColor}
          logo={logo} setLogo={setLogo}
          qrStyle={qrStyle} setQrStyle={setQrStyle}
        />
      </div>

      {/* SEO & Content Sections */}
      <div id="content-start">
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
