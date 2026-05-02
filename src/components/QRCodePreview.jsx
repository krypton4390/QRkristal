import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Image as ImageIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const QRCodePreview = ({ url, fgColor, bgColor, logo, qrStyle }) => {
  const qrRef = useRef(null);
  const qrCode = useRef(null);
  const [downloadStatus, setDownloadStatus] = useState(null); // 'success', 'error', null

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 600,
      height: 600,
      type: 'svg', // Use SVG as the primary rendering type
      data: url || "https://google.com",
      image: logo,
      dotsOptions: {
        color: fgColor,
        type: qrStyle === 'rounded' ? 'rounded' : 'square'
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
        imageSize: 0.4
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
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: url || "https://google.com",
        image: logo,
        dotsOptions: {
          color: fgColor,
          type: qrStyle === 'rounded' ? 'rounded' : 'square'
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          type: qrStyle === 'rounded' ? 'extra-rounded' : 'square',
          color: fgColor
        },
        cornersDotOptions: {
          type: qrStyle === 'rounded' ? 'dot' : 'square',
          color: fgColor
        }
      });
    }
  }, [url, fgColor, bgColor, logo, qrStyle]);

  // Helper: trigger a proper file download from a data URL
  const triggerDownload = (dataUrl, fileName) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    // Do NOT set target="_blank" — it breaks the download attribute
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
  };

  // Helper: convert an SVG element to a canvas-based data URL
  const svgToDataUrl = (svgElement, format, bgFill) => {
    return new Promise((resolve, reject) => {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);
      
      // Ensure proper XML namespaces
      if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.onload = () => {
        // Fill background first (important for JPEG which has no transparency)
        ctx.fillStyle = bgFill || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1200, 1200);
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        resolve(canvas.toDataURL(mimeType, 1.0));
      };
      img.onerror = () => reject(new Error('Failed to render QR code to image'));

      // Use a data URL (not a blob URL) for the image source to avoid CORS issues
      const encoded = btoa(unescape(encodeURIComponent(svgString)));
      img.src = 'data:image/svg+xml;base64,' + encoded;
    });
  };

  const handleDownload = async (extension) => {
    if (!qrRef.current) return;

    try {
      setDownloadStatus('processing');

      // Wait a tick to let the UI update to "processing" state
      await new Promise(r => setTimeout(r, 50));

      const svgElement = qrRef.current.querySelector('svg');
      const canvasElement = qrRef.current.querySelector('canvas');
      const fileName = `QRCode_${new Date().toISOString().slice(0,10)}.${extension}`;

      if (extension === 'svg') {
        if (!svgElement) throw new Error('No SVG element found');
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);
        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
          svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        // Use a data URL, NOT a blob URL — data URLs always respect download attr
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
        triggerDownload(dataUrl, fileName);

      } else if (extension === 'png' || extension === 'jpg') {
        if (svgElement) {
          // Render SVG → Canvas → Data URL
          const dataUrl = await svgToDataUrl(svgElement, extension, bgColor);
          triggerDownload(dataUrl, fileName);
        } else if (canvasElement) {
          // Directly grab from existing canvas
          const mimeType = extension === 'jpg' ? 'image/jpeg' : 'image/png';
          const dataUrl = canvasElement.toDataURL(mimeType, 1.0);
          triggerDownload(dataUrl, fileName);
        } else {
          throw new Error('No renderable QR element found');
        }
      }

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
    <div className="flex flex-col items-center justify-center space-y-16 lg:space-y-20 w-full max-w-2xl mt-16 lg:mt-0 z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="qr-container group relative"
      >
        <div className="bg-white p-4 rounded-2xl shadow-inner flex items-center justify-center w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] overflow-hidden [&>canvas]:max-w-full [&>canvas]:h-auto" ref={qrRef} />

        {/* Scannability Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 whitespace-nowrap z-20"
        >
          <ShieldCheck className={isValid ? "text-green-400 w-4 h-4" : "text-yellow-400 w-4 h-4"} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
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

