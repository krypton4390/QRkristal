# ✦ QR Crystal — Premium QR Code Generator

A high-performance, studio-grade QR Code Generator with Apple-style minimalism, glassmorphism UI, and real-time customization.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **🎨 Real-Time Preview** — Instant QR code updates as you type or change settings
- **🎯 Color Customization** — Independent foreground (dots) and background color pickers
- **🖼️ Logo Integration** — Drag-and-drop your brand logo into the center of the QR code
- **🔲 Pattern Styles** — Toggle between Classic (sharp) and Organic (rounded) dot patterns
- **📥 Multi-Format Export** — Download as high-resolution PNG (1200×1200), JPEG, or vector SVG
- **🛡️ Scannability Check** — Visual indicator confirming your QR code is readable
- **🌙 Dark Mode** — Premium dark theme with glassmorphism sidebar

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI |
| **Tailwind CSS v4** | Utility-first styling via Vite plugin |
| **qr-code-styling** | Advanced QR generation with rounded corners & logo support |
| **Framer Motion** | Smooth animations & transitions |
| **Lucide React** | Clean, minimal icons |
| **Vite 8** | Lightning-fast dev server & bundler |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/QR-Code_generator.git
cd QR-Code_generator

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 📂 Project Structure

```
QR-Code_generator/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── QRCodePreview.jsx        # QR rendering & export engine
│   │   └── CustomizationPanel.jsx   # Sidebar controls
│   ├── App.jsx              # Main layout & state management
│   ├── index.css            # Tailwind v4 config & custom styles
│   └── main.jsx             # React entry point
├── index.html               # HTML template with Outfit font
├── vite.config.js           # Vite + Tailwind plugin
└── package.json
```

## 📸 Screenshots

> _Add screenshots of your app here_

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>Designed for Excellence</b> · Powered by QR Crystal Engine v2.0
</p>
