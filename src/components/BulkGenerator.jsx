import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Download, RefreshCcw, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

const BulkGenerator = () => {
  const [data, setData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          setError("The file is empty.");
          return;
        }

        // Look for URL/Data column
        const firstRow = rawData[0];
        const dataKey = Object.keys(firstRow).find(key => 
          ['URL', 'Data', 'Link', 'url', 'data'].includes(key.trim())
        );

        if (!dataKey) {
          setError("No 'URL' or 'Data' column found in the file.");
          return;
        }

        const formattedData = rawData.map((row, index) => ({
          content: row[dataKey],
          filename: row['Filename'] || row['filename'] || row['Name'] || `qr-code-${index + 1}`
        })).slice(0, 1000); // Limit to 1000

        setData(formattedData);
        setPreview(formattedData.slice(0, 5));
        setError(null);
      } catch (err) {
        setError("Error parsing file. Please use a valid .xlsx or .csv.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const generateZip = async () => {
    if (data.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    const zip = new JSZip();
    const qrFolder = zip.folder("qr_codes");

    try {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        // Generate QR as DataURL (base64)
        // Memory Tip: For 1000 codes, base64 is fine as they are small (avg 5-10KB).
        // Total memory for 1000 codes ~10MB, which fits easily in browser RAM.
        const dataUrl = await QRCode.toDataURL(row.content, {
          width: 512,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });

        // Add to ZIP (remove the data:image/png;base64, prefix)
        const base64Data = dataUrl.split(',')[1];
        qrFolder.file(`${row.filename}.png`, base64Data, { base64: true });

        // Update progress
        setProgress(Math.round(((i + 1) / data.length) * 100));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const outName = `QR_Crystal_Bulk_${new Date().getTime()}.zip`;

      triggerDownload(content, outName);
      setIsProcessing(false);
    } catch (err) {
      setError("An error occurred during generation.");
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setData([]);
    setPreview([]);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 lg:p-12 space-y-12 mt-16 lg:mt-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl lg:text-5xl font-black text-white">Bulk Generator</h2>
        <p className="text-white/40 max-w-xl mx-auto">
          Upload an Excel or CSV file with a <code className="text-blue-400">URL</code> column. 
          Generate up to 1000 codes in seconds, 100% locally.
        </p>
      </div>

      {!data.length ? (
        <label className="flex flex-col items-center justify-center w-full h-64 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <FileSpreadsheet className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">Drop your spreadsheet here</p>
              <p className="text-sm text-white/30 uppercase tracking-widest font-bold mt-1">Supports .xlsx, .csv (Max 1000 rows)</p>
            </div>
          </div>
          <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
        </label>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Preview Table */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Preview (First 5 Rows)</h3>
              </div>
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Total: {data.length} codes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
                  <tr>
                    <th className="px-6 py-4">Filename</th>
                    <th className="px-6 py-4">Content / URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {preview.map((row, i) => (
                    <tr key={i} className="text-sm text-white/60">
                      <td className="px-6 py-4 font-mono">{row.filename}.png</td>
                      <td className="px-6 py-4 truncate max-w-xs">{row.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center space-y-6">
            {isProcessing ? (
              <div className="w-full space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                  <span>Processing Assets...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                <p className="text-center text-xs text-white/20 font-bold uppercase tracking-widest animate-pulse">
                  Generating high-fidelity QR vectors...
                </p>
              </div>
            ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
                <button 
                  onClick={generateZip}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  <Download className="w-5 h-5" />
                  Generate & Download ZIP
                </button>
                <button 
                  onClick={reset}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
        {[
          { title: "Privacy First", desc: "Files never leave your browser. Processing is 100% client-side." },
          { title: "Excel Optimized", desc: "Auto-detects 'URL' or 'Data' columns. Handles up to 1000 rows." },
          { title: "Instant ZIP", desc: "Codes are packaged into a clean ZIP file with custom filenames." }
        ].map((feat, i) => (
          <div key={i} className="space-y-2">
            <h4 className="text-white font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {feat.title}
            </h4>
            <p className="text-white/30 text-xs leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkGenerator;
