import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Palette, Upload, Settings2, Trash2, ChevronRight } from 'lucide-react';

const CustomizationPanel = ({ 
  url, setUrl, 
  fgColor, setFgColor, 
  bgColor, setBgColor, 
  logo, setLogo,
  qrStyle, setQrStyle 
}) => {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full lg:w-[420px] glass-morphism h-auto lg:h-screen p-6 lg:p-10 flex flex-col space-y-12 overflow-y-visible lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 shadow-2xl relative z-50">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <Settings2 className="w-3 h-3 text-white/50" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Configuration</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-white">Design</h2>
      </div>

      <div className="space-y-10">
        {/* URL Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/70">
              <Link2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-[0.15em]">Content</span>
            </div>
            {url && (
               <span className="text-[10px] font-bold text-blue-400/80 uppercase">Active</span>
            )}
          </div>
          <div className="group relative">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-brand.com"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-5 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium text-lg shadow-inner"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-white/70">
            <Palette className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">Appearance</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Dots</label>
              <div className="relative h-16 group">
                <input 
                  type="color" 
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-full bg-transparent cursor-pointer rounded-2xl overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                />
                <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors shadow-lg" />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Background</label>
              <div className="relative h-16 group">
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-full bg-transparent cursor-pointer rounded-2xl overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                />
                <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white/70">
            <Upload className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">Branding</span>
          </div>
          
          <AnimatePresence mode="wait">
            {!logo ? (
              <motion.label 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center w-full h-40 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-white/40 group-hover:text-white/70" />
                  </div>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Drop logo here</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </motion.label>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="w-full h-40 bg-white/[0.03] rounded-3xl flex items-center justify-center p-8 border border-white/10 shadow-inner">
                  <img src={logo} alt="Logo preview" className="max-h-full max-w-full rounded-xl shadow-2xl object-contain" />
                </div>
                <button 
                  onClick={() => setLogo(null)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Style Selection */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center space-x-2 text-white/70">
            <Settings2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">Pattern Style</span>
          </div>
          
          <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setQrStyle('square')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${qrStyle === 'square' ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'text-white/30 hover:text-white/60'}`}
            >
              Classic
            </button>
            <button 
              onClick={() => setQrStyle('rounded')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${qrStyle === 'rounded' ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'text-white/30 hover:text-white/60'}`}
            >
              Organic
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-10">
        <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Pro Tip</p>
          <p className="text-sm text-white/60 leading-relaxed font-medium">
            Use high-contrast colors and a clear center logo for maximum scannability across all devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
