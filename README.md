# SecurePay — Checkout UI

<div align="center">

![SecurePay Banner](https://img.shields.io/badge/SecurePay-Checkout%20UI-5b6ef5?style=for-the-badge&logo=shield&logoColor=white)

**A premium, fully animated payment checkout interface built with vanilla HTML, CSS & JavaScript.**  
Inspired by Stripe, Razorpay & modern Indian fintech UX.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Payment Methods](#-payment-methods)
- [Responsiveness](#-responsiveness)
- [Animations & UX](#-animations--ux)
- [Known Limitations](#-known-limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**SecurePay** is a production-inspired payment checkout UI that simulates a real-world payment gateway experience. It features a 3D animated credit card preview, live card validation, multi-currency support, and a fully upgraded Net Banking flow with real bank logos — all without a backend.

This project is ideal for:
- Frontend portfolio showcase
- Payment UI/UX reference
- Learning GSAP animations & Three.js integration
- Studying real-time form validation patterns

---

## 🚀 Live Demo


---

## ✨ Features

### 💳 Card Payment
| Feature | Description |
|---|---|
| 3D Card Preview | Real-time front/back flip with GSAP animations |
| Live Card Number Formatting | Auto-formats as `XXXX XXXX XXXX XXXX` while typing |
| Network Auto-Detection | Detects Visa, Mastercard, Amex, Discover, RuPay from first digits |
| Dynamic Card Themes | Card background changes per network (navy for Visa, red for MC, etc.) |
| Stripe-style Tilt | Card tilts toward cursor on hover (disabled on touch devices) |
| Focus Ring | Glowing highlight on card face maps to active input field |
| Cardholder Name Sync | Name updates live on card as user types |
| Expiry & CVV Validation | Month/year combo validated against current date; CVV flips card to back |
| Saved Cards | Quick-fill from saved card list with GSAP bounce animation |
| Real-time Validation | Inline error messages with valid/error border states |

### 🏦 Net Banking *(Fully Upgraded)*
| Feature | Description |
|---|---|
| 18 Indian Banks | Popular, Private, and Public sector banks |
| Real Bank Logos | Loaded via Clearbit Logo API with graceful fallback |
| Live Search | Instant filter by bank name; auto-switches to "All Banks" tab |
| Category Tabs | Filter by Popular / Private / Public / All Banks |
| Scrollable Grid | Custom scrollbar, max-height constrained for clean UX |
| Active State | Selected bank gets checkmark + accent border |
| Selected Bar | Shows bank logo + name with "Change ✕" option |
| Session Timer | 10-minute countdown with SVG arc + urgent red pulse below 60s |
| Disabled Button | Continue button locked until a bank is selected |
| Redirect Overlay | Full-screen animated redirect simulation with progress bar |
| Trust Badges | 256-bit SSL · RBI Compliant · PCI DSS |

### 📱 UPI
- UPI ID input field
- One-tap app buttons: GPay, PhonePe, Paytm, BHIM

### 🎉 Post-Payment
- Success screen with animated ring
- Auto-populated receipt: Transaction ID, amount, card/bank, timestamp
- Print / Download receipt button

### 🌐 Multi-Currency
- Switch between USD, EUR, GBP, INR, JPY
- Amount updates live with GSAP scale animation

---

## 🛠 Tech Stack

| Library | Version | Purpose |
|---|---|---|
| [Three.js](https://threejs.org) | r128 | 3D particle background (coins, candlesticks, network nodes) |
| [GSAP](https://greensock.com/gsap/) | 3.12.2 | All UI animations — entry reveals, card tilt, tab transitions |
| [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/) | 3.12.2 | Scroll-linked animation support |
| [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/) | 4.1.4 | Smooth scroll (desktop only; disabled on mobile/touch) |
| [Bootstrap](https://getbootstrap.com) | 5.3.0 | Grid utilities |
| [Google Fonts](https://fonts.google.com) | — | Syne (display) + Space Mono (mono) |
| [Clearbit Logo API](https://clearbit.com/logo) | — | Real bank logos via domain lookup |

---

## 📁 Project Structure

```
securepay/
├── index.html       # Main HTML — layout, card markup, all payment tabs
├── style.css        # All styles — layout, card, form, net banking, responsive
├── script.js        # All JavaScript — Three.js, GSAP, validation, net banking logic
└── README.md        # This file
```

> No build tools, no npm, no bundler. Pure vanilla — just open and run.

---

## 🏁 Getting Started

### Prerequisites
- Any modern browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server (required for Clearbit logo CDN to work correctly)

### Option 1 — VS Code Live Server *(Recommended)*
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500`

### Option 2 — Python HTTP Server
```bash
# Python 3
python -m http.server 3000
# Then open http://localhost:3000
```

### Option 3 — Node.js
```bash
npx serve .
# Then open the URL shown in terminal
```

### Clone the Repository
```bash
git clone https://github.com/your-username/securepay-checkout.git
cd securepay-checkout
```

---

## 💳 Payment Methods

### Card Flow
```
Enter card number → Network detected → Fill name/expiry/CVV → Submit → Success screen
```

### Net Banking Flow
```
Click Net Banking tab → Timer starts (10:00) → Search / select bank
→ Click Continue → Redirect animation → Success screen
```

### UPI Flow
```
Enter UPI ID  OR  tap GPay / PhonePe / Paytm / BHIM → Pay button
```

---

## 📱 Responsiveness

The UI is fully responsive across all device sizes:

| Breakpoint | Target | Behaviour |
|---|---|---|
| `> 980px` | Desktop | Two-column layout (card preview + form side by side) |
| `861–980px` | Large tablet | Reduced left-col width, tighter gap |
| `≤ 860px` | iPad / tablet | Single-column stacked layout |
| `≤ 600px` | Large phones | Reduced padding, 2-col bank grid, compact forms |
| `≤ 400px` | Small phones | Minimum sizes, 2-col bank grid, compact everything |
| Landscape `h < 500px` | Phones rotated | Side-by-side re-enabled, non-essential sections hidden |

**Mobile-specific behaviour:**
- Locomotive Scroll is **disabled** on touch/mobile — native scroll is used instead
- Card 3D tilt is **disabled** on touch devices; tap-to-flip gesture added
- Three.js particle count reduced from 200 → 80 for mobile GPU performance

---

## 🎨 Animations & UX

| Interaction | Animation |
|---|---|
| Page load | Staggered GSAP reveal for left + right columns |
| Card float | Continuous sine-wave float via GSAP repeat |
| Card tilt | Cursor-tracked 3D tilt (±12° Y, ±10° X) |
| Card flip | GSAP rotateY 0° ↔ 180° on CVV focus |
| Card network switch | GSAP scale-in logo + instant background theme change |
| Form input focus | Glowing focus ring repositions to matching card field |
| Saved card select | GSAP scale bounce on card scene |
| Currency change | GSAP scale pop on amount display |
| Net banking bank select | Stagger fade-in on grid render |
| Redirect overlay | Progress bar + pulsing dots + glowing bank logo |
| Success screen | GSAP scale + fade from 0.88 with back-ease |
| Form error shake | GSAP x-axis shake on invalid submit |
| Three.js background | Floating coins, candlestick chart, network nodes, particle drift |

---

## ⚠️ Known Limitations

- **No real payment processing** — this is a UI demo only. No actual transactions occur.
- **Bank logos require internet** — Clearbit Logo API is used; logos won't load in a fully offline environment. Coloured text fallbacks are shown instead.
- **Locomotive Scroll** — disabled on touch devices to prevent scroll conflicts. A production app might use a more robust solution.
- **CVV not masked on card back** — dots are shown but this is a visual simulation only.
- **Session timer resets** on every tab switch — in a real app this would be server-controlled.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

### Commit Convention
This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | CSS/visual changes |
| `refactor:` | Code restructure without behaviour change |
| `docs:` | Documentation updates |
| `chore:` | Build / config changes |

---

## 📄 License

```
MIT License

Copyright (c) 2026 SecurePay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

Made with ❤️ using vanilla HTML · CSS · JavaScript

⭐ **Star this repo** if you found it useful!

</div>
