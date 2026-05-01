import React, { useState } from 'react';
import QRCodePreview from './components/QRCodePreview';
import CustomizationPanel from './components/CustomizationPanel';

function App() {
  const [url, setUrl] = useState('https://google.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [qrStyle, setQrStyle] = useState('rounded');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#050505] text-white overflow-y-auto lg:overflow-hidden font-sans selection:bg-white selection:text-black">
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
            <h1 className="text-2xl font-black tracking-tight">QR Crystal</h1>
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


        {/* Footer Credit */}
        <div className="absolute bottom-6 lg:bottom-10 flex flex-col items-center space-y-2 z-10">
          <div className="flex items-center space-x-4">
             <span className="text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase">Engine Status: Optimal</span>
          </div>
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
  );
}

export default App;
