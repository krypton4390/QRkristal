import React, { useState, useRef, useEffect, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Building2, Phone, Link2, Mail, ShieldCheck, Download, FileText, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

// --- Utility: Sanitize LinkedIn URL ---
const sanitizeLinkedIn = (url) => {
  if (!url) return { clean: '', warnings: [] };
  const warnings = [];
  try {
    const parsed = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'trk', 'lipi', 'lici', 'originalSubdomain', 'midToken', 'midSig', 'trkEmail'];
    const removed = [];
    trackingParams.forEach(p => {
      if (parsed.searchParams.has(p)) {
        removed.push(p);
        parsed.searchParams.delete(p);
      }
    });
    if (removed.length > 0) {
      warnings.push(`Removed ${removed.length} tracking parameter(s): ${removed.join(', ')}`);
    }
    // Normalize to clean profile URL
    let clean = parsed.origin + parsed.pathname;
    // Remove trailing slash
    clean = clean.replace(/\/+$/, '');
    return { clean, warnings };
  } catch (e) {
    return { clean: url, warnings: ['Invalid URL format — could not sanitize'] };
  }
};

// --- Utility: Generate vCard 3.0 ---
const generateVCard = ({ fullName = '', role = '', company = '', whatsapp = '', linkedin = '', instagram = '', youtube = '', email = '' }) => {
  const safeFullName = (fullName || '').trim();
  const parts = safeFullName.split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
  vcard += `N:${lastName};${firstName};;;\r\n`;
  vcard += `FN:${safeFullName}\r\n`;
  if (company) vcard += `ORG:${company}\r\n`;
  if (role) vcard += `TITLE:${role}\r\n`;
  if (whatsapp) vcard += `TEL;TYPE=CELL:${whatsapp}\r\n`;
  if (email) vcard += `EMAIL;TYPE=INTERNET:${email}\r\n`;
  if (linkedin) vcard += `URL;type=LinkedIn:${linkedin}\r\n`;
  if (instagram) vcard += `URL;type=Instagram:${instagram}\r\n`;
  if (youtube) vcard += `URL;type=YouTube:${youtube}\r\n`;

  vcard += `END:VCARD\r\n`;
  return vcard;
};

const VCardGenerator = () => {
  console.log('VCardGenerator rendering...');
  const [form, setForm] = useState({
    fullName: '',
    role: '',
    company: '',
    whatsapp: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    email: '',
    qrLogo: null
  });
  const [safetyResult, setSafetyResult] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef(null);
  const qrInstance = useRef(null);

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

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const isFormValid = (form.fullName || '').trim().length > 0 && (form.email || form.whatsapp || form.linkedin || form.instagram || form.youtube);

  // Run safety check on LinkedIn URL
  useEffect(() => {
    if (form.linkedin) {
      const result = sanitizeLinkedIn(form.linkedin);
      setSafetyResult(result);
      if (result.warnings.length > 0 && result.clean !== form.linkedin) {
        update('linkedin', result.clean);
      }
    } else {
      setSafetyResult(null);
    }
  }, [form.linkedin]);

  const refreshQR = (newLogo = form.qrLogo) => {
    const vcard = generateVCard({ ...form });
    
    // RELIABILITY: Create a fresh instance to avoid .update() image loading race conditions
    qrInstance.current = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'canvas',
      data: vcard,
      image: newLogo || undefined,
      qrOptions: { errorCorrectionLevel: 'H' },
      dotsOptions: { color: '#1a1a2e', type: 'rounded' },
      backgroundOptions: { color: '#ffffff' },
      imageOptions: { margin: 8, imageSize: 0.35, hideBackgroundDots: true },
      cornersSquareOptions: { type: 'extra-rounded', color: '#1a1a2e' },
      cornersDotOptions: { type: 'dot', color: '#1a1a2e' }
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrInstance.current.append(qrRef.current);
    }
  };

  const handleGenerate = useCallback(() => {
    setQrGenerated(true);
    // Use a small timeout to ensure the DOM ref is ready if it's the first time
    setTimeout(() => refreshQR(), 50);
  }, [form]);


  // Download as PDF Table Tent
  const handleDownloadPDF = async () => {
    if (!qrInstance.current) return;

    // Get QR as base64 PNG from canvas element
    const canvasEl = qrRef.current?.querySelector('canvas');
    if (!canvasEl) return;
    const qrDataUrl = canvasEl.toDataURL('image/png', 1.0);

    // Dynamically import jsPDF to avoid module-level crash
    const { jsPDF } = await import('jspdf');

    // Create PDF (A4 landscape, folded = table tent)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = 297;
    const pageH = 210;
    const halfH = pageH / 2;

    // --- Top half (will be the BACK when folded — shows contact info) ---
    pdf.setFillColor(26, 26, 46);
    pdf.rect(0, 0, pageW, halfH, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(form.fullName || 'Your Name', pageW / 2, 30, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(180, 180, 200);
    if (form.role && form.company) {
      pdf.text(`${form.role} at ${form.company}`, pageW / 2, 42, { align: 'center' });
    } else if (form.role) {
      pdf.text(form.role, pageW / 2, 42, { align: 'center' });
    } else if (form.company) {
      pdf.text(form.company, pageW / 2, 42, { align: 'center' });
    }

    // Contact details on back panel
    let yPos = 58;
    pdf.setFontSize(11);
    pdf.setTextColor(200, 200, 220);
    const details = [];
    if (form.email) details.push(`Email: ${form.email}`);
    if (form.whatsapp) details.push(`WhatsApp: ${form.whatsapp}`);
    if (form.linkedin) details.push(`LinkedIn: ${sanitizeLinkedIn(form.linkedin).clean}`);
    if (form.instagram) details.push(`Instagram: ${form.instagram}`);
    if (form.youtube) details.push(`YouTube: ${form.youtube}`);
    details.forEach(d => {
      pdf.text(d, pageW / 2, yPos, { align: 'center' });
      yPos += 8;
    });

    // Branding
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 120);
    pdf.text('Generated with QR Crystal — qrcrystal.xyz', pageW / 2, halfH - 8, { align: 'center' });

    // --- Fold line ---
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineDashPattern([3, 3], 0);
    pdf.line(10, halfH, pageW - 10, halfH);
    pdf.setFontSize(7);
    pdf.setTextColor(180, 180, 180);
    pdf.text('✂ FOLD HERE', pageW / 2, halfH + 3, { align: 'center' });

    // --- Bottom half (FRONT when folded — shows QR code) ---
    // This half is upside-down so it reads correctly when folded
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, halfH + 0.5, pageW, halfH, 'F');

    // QR code centered on front
    const qrSize = 65;
    const qrX = (pageW - qrSize) / 2;
    const qrY = halfH + (halfH - qrSize) / 2 - 5;
    pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // Label under QR
    pdf.setTextColor(26, 26, 46);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Scan to save my contact', pageW / 2, qrY + qrSize + 10, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 140);
    pdf.text(form.fullName || '', pageW / 2, qrY + qrSize + 18, { align: 'center' });

    // Save
    const safeName = (form.fullName || 'vcard').replace(/\s+/g, '_').toLowerCase();
    pdf.save(`${safeName}_table_tent.pdf`);
  };

  // Download raw .vcf file
  const handleDownloadVCF = () => {
    const cleanLinkedin = form.linkedin ? sanitizeLinkedIn(form.linkedin).clean : '';
    const vcard = generateVCard({ ...form, linkedin: cleanLinkedin });
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const outName = `${(form.fullName || 'contact').replace(/\s+/g, '_').toLowerCase()}.vcf`;

    triggerDownload(blob, outName);
  };

  // Download QR — generates a fresh hi-res instance for export quality
  const handleDownloadQR = async (extension) => {
    if (!qrInstance.current) return;
    try {
      const cleanLinkedin = form.linkedin ? sanitizeLinkedIn(form.linkedin).clean : '';
      const vcard = generateVCard({ ...form, linkedin: cleanLinkedin });
      const safeName = (form.fullName || 'vcard').replace(/\s+/g, '_').toLowerCase();

      // Build a high-res instance for export
      const hiRes = new QRCodeStyling({
        width: 1200,
        height: 1200,
        type: 'canvas',
        data: vcard,
        image: form.qrLogo || undefined,
        dotsOptions: { color: '#1a1a2e', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        imageOptions: { margin: 20, imageSize: 0.35, hideBackgroundDots: true },
        cornersSquareOptions: { type: 'extra-rounded', color: '#1a1a2e' },
        cornersDotOptions: { type: 'dot', color: '#1a1a2e' },
        qrOptions: { errorCorrectionLevel: 'H' }
      });

      // Reliable Download via getRawData and file-saver
      const blob = await hiRes.getRawData(extension);
      const outName = `${safeName}_qr.${extension}`;

      if (blob) {
        triggerDownload(blob, outName);
      }
    } catch (err) {
      console.error('QR export failed:', err);
    }
  };


  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    // SECURITY: Limit logo size to 2MB to prevent browser freezing
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo is too large! Please use an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      update(key, reader.result);
      // Automatically refresh the QR if it has already been generated
      if (qrGenerated) refreshQR(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const fields = [
    { key: 'fullName', label: 'Full Name', placeholder: 'Krystal Bhandari', icon: User, required: true },
    { key: 'role', label: 'Role / Title', placeholder: 'Software Engineer', icon: Briefcase },
    { key: 'company', label: 'Company', placeholder: 'QR Crystal', icon: Building2 },
    { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+977 9800000000', icon: Phone },
    { key: 'email', label: 'Email Address', placeholder: 'hello@example.com', icon: Mail },
    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourname', icon: Link2 },
    { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/yourname', icon: Link2 },
    { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@yourchannel', icon: Link2 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 lg:p-12 space-y-10 mt-16 lg:mt-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-green-400">Privacy-First • 100% Client-Side</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">vCard QR Generator</h2>
        <p className="text-white/40 text-sm sm:text-base max-w-lg mx-auto">Create a scannable contact card. No data leaves your browser.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* QR Center Logo Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <Building2 className="w-3.5 h-3.5" />
              QR Center Logo
            </label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'qrLogo')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full h-12 rounded-2xl border border-dashed flex items-center justify-center transition-all ${form.qrLogo ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.03] border-white/10 group-hover:border-white/20'}`}>
                {form.qrLogo ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Logo Added</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Upload Logo (optional)</span>
                )}
              </div>
            </div>
          </div>

          {fields.map(({ key, label, placeholder, icon: Icon, required }) => (
            <div key={key} className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
                {required && <span className="text-red-400">*</span>}
              </label>
              <input
                type="text"
                value={form[key] || ''}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/15 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
              />
            </div>
          ))}

          {/* Safety Check Result */}
          <AnimatePresence>
            {safetyResult && safetyResult.warnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-amber-400 text-sm font-bold">Safety Check Applied</p>
                  {safetyResult.warnings.map((w, i) => (
                    <p key={i} className="text-amber-400/70 text-xs">{w}</p>
                  ))}
                  <p className="text-amber-400/50 text-xs">Clean URL: {safetyResult.clean}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!isFormValid}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.08)] disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <Zap className="w-5 h-5" />
            Generate vCard QR Code
          </button>
        </div>

        {/* Right: QR Preview + Downloads */}
        <div className="space-y-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-12 flex flex-col items-center space-y-8">
            {!qrGenerated ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-white/10">
                <User className="w-16 h-16" />
                <p className="text-sm font-bold uppercase tracking-widest">Fill the form & generate</p>
              </div>
            ) : (
              <>
                <div
                  ref={qrRef}
                  className="bg-white p-3 rounded-2xl shadow-inner overflow-hidden flex items-center justify-center max-w-full"
                  style={{ width: 'min(100%, 280px)', height: 'min(100%, 280px)', aspectRatio: '1/1', flexShrink: 0 }}
                />
                <div className="text-center space-y-1">
                  <p className="text-white font-bold text-lg">{form.fullName}</p>
                  <p className="text-white/40 text-sm">
                    {[form.role, form.company].filter(Boolean).join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Scannable & Private</span>
                </div>
              </>
            )}
          </div>

          {qrGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Primary: QR Image Downloads */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 text-center">Download QR Code</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDownloadQR('png')}
                    className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownloadQR('jpg')}
                    className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                  >
                    <Download className="w-4 h-4" />
                    JPEG
                  </button>
                  <button
                    onClick={() => handleDownloadQR('svg')}
                    className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-bold text-sm hover:bg-white/20 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    SVG
                  </button>
                </div>
              </div>

              {/* Secondary: Other Formats */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 text-center">Other Formats</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold text-sm hover:bg-white/10 active:scale-95 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    PDF Table Tent
                  </button>
                  <button
                    onClick={handleDownloadVCF}
                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold text-sm hover:bg-white/10 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    .VCF File
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VCardGenerator;
