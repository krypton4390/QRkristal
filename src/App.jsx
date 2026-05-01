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
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] left-[20%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-[40%] right-[30%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        {/* Top Navigation / Brand */}
        <div className="absolute top-10 left-12 flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="w-6 h-6 border-[5px] border-black rounded-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic">QRCRAFT</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold -mt-1">Studio Edition</p>
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
        <div className="absolute bottom-10 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
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
