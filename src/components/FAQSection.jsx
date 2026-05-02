import React, { useEffect } from 'react';

const faqs = [
  {
    question: "Do QR codes generated on QR Crystal expire?",
    answer: "No. All static QR codes generated through our platform are permanent. They are encoded directly into the pattern and do not depend on our servers to function, ensuring they work as long as the underlying link or data is active."
  },
  {
    question: "Are QR codes secure for my users?",
    answer: "Yes. QR Crystal generates \"Clean\" QR codes without intermediate tracking redirects, reducing the risk of \"QRishing\" (QR phishing). Security risks only arise if the URL they point to is malicious."
  },
  {
    question: "Can I change the destination of my QR code after printing?",
    answer: "If you generate a Static QR code, the data is hardcoded and cannot be changed. For updateable links, you must use a Dynamic QR code which uses a redirect service."
  },
  {
    question: "Is there a cost to keep my QR codes active?",
    answer: "QR Crystal provides free static QR codes that require no subscription and never expire. We believe basic utility tools should be accessible to everyone without hidden fees."
  },
  {
    question: "What is the maximum scan distance for a QR code?",
    answer: "The scan distance typically follows a 10:1 ratio. For example, a 1-inch (2.5cm) QR code is best scanned from 10 inches (25cm) away. For billboards or posters, ensure the QR code is large enough."
  },
  {
    question: "Can I add a brand logo without breaking the scan?",
    answer: "Yes. QR codes have built-in Error Correction (up to 30%). This allows you to place a logo in the center while maintaining scannability. We recommend \"High\" error correction for custom branding."
  },
  {
    question: "What is the best file format for printing QR codes?",
    answer: "For professional printing (business cards, banners), always use SVG (Vector) format. Unlike PNG, SVG files can be scaled to any size without losing sharpness, ensuring a perfect scan."
  },
  {
    question: "Do you track who scans my QR codes?",
    answer: "QR Crystal prioritizes privacy. Since we generate static codes that link directly to your destination, we do not sit in the middle of the scan process and therefore do not track your users' data."
  }
];

const FAQSection = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="py-24 px-6 lg:px-12 bg-black/50 backdrop-blur-xl border-t border-white/5" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors">
                {faq.question}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
