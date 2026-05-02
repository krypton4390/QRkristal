import React from 'react';

const ContentPillar = () => {
  return (
    <section className="py-24 px-6 lg:px-12 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-2/3 space-y-8">
            <h2 className="text-5xl font-black leading-tight">
              Why Vector (SVG) QR Codes are Essential for High-Resolution Printing
            </h2>
            <div className="prose prose-lg text-black/70 leading-relaxed space-y-6">
              <p>
                In the world of professional design and marketing, "good enough" is a recipe for disaster. When you are printing thousands of business cards, luxury packaging, or massive event banners, the clarity of your QR code isn't just an aesthetic choice—it is a functional necessity.
              </p>
              <p>
                Most free generators provide low-resolution raster images (like PNG or JPG) that pixelate when scaled. This pixelation creates "fuzzy" edges that modern smartphone cameras struggle to interpret, leading to frustrated customers and failed marketing campaigns.
              </p>
              <p>
                At QR Crystal, we bridge the gap between utility and professional design. Our engine is built on vector-first principles, ensuring that every pixel is mathematically defined rather than statically drawn. This is critical for industrial printing processes where ink-bleed and material texture can already affect scannability.
              </p>
              <p>
                By providing native SVG (Scalable Vector Graphics) output, we empower designers to integrate QR codes into Adobe Illustrator, Figma, or Canva without any loss of fidelity. Whether you are an engineer looking for a reliable asset tracking solution or a creative director building a premium brand identity, QR Crystal provides the precision required for high-stakes physical media.
              </p>
            </div>
          </div>

          <div className="lg:w-1/3 bg-black/5 p-8 rounded-3xl border border-black/10">
            <h3 className="text-xl font-bold mb-6">Professional Features</h3>
            <ul className="space-y-4">
              {[
                { title: "Infinite Scalability", desc: "SVG format for billboards or business cards." },
                { title: "Advanced Error Correction", desc: "Scannability even with 30% damage." },
                { title: "Quiet Zone Control", desc: "Adjustable buffers for complex layouts." },
                { title: "CMYK Compatibility", desc: "Works with professional print profiles." },
                { title: "Direct-to-Data", desc: "No middleman redirects, ever." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-black/50">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentPillar;
