import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Image as ImageIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const QRCodePreview = ({ url, fgColor, bgColor, logo, qrStyle }) => {
  const qrRef = useRef(null);
  const qrCode = useRef(null);
  const [downloadStatus, setDownloadStatus] = useState(null); // 'success', 'error', null

  useEffect(() => {
    const renderQR = () => {
      // Create a fresh instance to avoid .update() image loading race conditions
      const safeLogo = (logo && logo.length > 10) ? logo : undefined;
      
      qrCode.current = new QRCodeStyling({
        width: 600,
        height: 600,
        type: 'canvas',
        data: url || "https://qrcrystal.xyz/",
        image: safeLogo,
        dotsOptions: {
          color: fgColor,
          type: qrStyle === 'rounded' ? 'rounded' : 'square'
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          margin: 10,
          imageSize: 0.3,
          hideBackgroundDots: true
        },
        cornersSquareOptions: {
          type: qrStyle === 'rounded' ? 'extra-rounded' : 'square',
          color: fgColor
        },
        cornersDotOptions: {
          type: qrStyle === 'rounded' ? 'dot' : 'square',
          color: fgColor
        },
        qrOptions: {
          errorCorrectionLevel: 'H'
        }
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qrCode.current.append(qrRef.current);
      }
    };

    const updateTimer = setTimeout(renderQR, 50);
    return () => clearTimeout(updateTimer);
  }, [url, fgColor, bgColor, logo, qrStyle]);


  // Helper: trigger a proper file download from a Blob
  const triggerDownload = (blob, fileName) => {

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (extension) => {
    if (!qrCode.current) return;

    try {
      setDownloadStatus('processing');
      const fileName = `QRCode_${new Date().toISOString().slice(0,10)}.${extension}`;
      const canvasEl = qrRef.current?.querySelector('canvas');
      if ((extension === 'png' || extension === 'jpg') && canvasEl) {
        const mime = extension === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvasEl.toDataURL(mime, 1.0);
        const anchor = document.createElement('a');
        anchor.href = dataUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setDownloadStatus('success');
        setTimeout(() => setDownloadStatus(null), 3000);
        return;
      }

      // RELIABILITY: Use getRawData directly from the library to get the Blob, bypassing buggy internal downloads
      let blobType = 'image/png';
      if (extension === 'svg') blobType = 'image/svg+xml';
      if (extension === 'jpg') blobType = 'image/jpeg';

      const blob = await qrCode.current.getRawData(extension);

      if (!blob) throw new Error('Failed to generate QR data');
      
      triggerDownload(blob, fileName);

      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus(null), 3000);
    } catch (err) {
      console.error('Export failed:', err);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 3000);
    }
  };


  const isUrlValid = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValid = isUrlValid(url);

  return (
    <div className="flex flex-col items-center justify-center space-y-16 lg:space-y-20 w-full max-w-2xl mt-16 lg:mt-12 z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="qr-container group relative"
      >
        <div className="bg-white p-3 sm:p-4 rounded-[2rem] shadow-inner flex items-center justify-center w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] overflow-hidden [&>canvas]:max-w-full [&>canvas]:h-auto transition-all duration-500" ref={qrRef} />

        {/* Scannability Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 whitespace-nowrap z-20"
        >
          <ShieldCheck className={isValid ? "text-green-400 w-3.5 h-3.5 sm:w-4 sm:h-4" : "text-yellow-400 w-3.5 h-3.5 sm:w-4 sm:h-4"} />
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/80">
            {isValid ? "Premium Scannability" : "Waiting for valid URL"}
          </span>
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-center space-y-6 pt-4">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button 
            onClick={() => handleDownload('png')}
            disabled={downloadStatus === 'processing'}
            className="flex items-center space-x-2 bg-white text-black px-4 py-3 sm:px-6 sm:py-4 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-2xl group disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>PNG</span>
          </button>
          <button 
            onClick={() => handleDownload('jpg')}
            disabled={downloadStatus === 'processing'}
            className="flex items-center space-x-2 bg-white text-black px-4 py-3 sm:px-6 sm:py-4 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-2xl group disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>JPEG</span>
          </button>
          <button 
            onClick={() => handleDownload('svg')}
            disabled={downloadStatus === 'processing'}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95 group disabled:opacity-50"
          >
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>SVG</span>
          </button>
        </div>

        <AnimatePresence>
          {downloadStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
                downloadStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                downloadStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              {downloadStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
               downloadStatus === 'error' ? <AlertCircle className="w-4 h-4" /> :
               <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              <span className="text-xs font-bold uppercase tracking-widest">
                {downloadStatus === 'success' ? 'Download Started' :
                 downloadStatus === 'error' ? 'Export Failed' :
                 'Preparing High-Res File...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QRCodePreview;

