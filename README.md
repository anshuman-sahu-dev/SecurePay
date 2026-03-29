# 💳 SecurePay — *Checkout ka naya andaaz, security ke saath.*

> Premium payment experience. Animated. Validated. Real-world ready.

![SecurePay Banner](assets/favicon.png)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Pages & Sections](#pages--sections)
- [Payment Methods](#payment-methods)
- [Design](#design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Responsiveness](#responsiveness)
- [Contact](#contact)
- [License](#license)

---

## 📖 About the Project

**SecurePay** is a premium, fully animated payment checkout UI that replicates the look, feel, and flow of a real-world payment gateway — think Razorpay, Stripe, and PhonePe — all rolled into one clean interface.

Built entirely with **vanilla HTML, CSS & JavaScript** (no frameworks, no bundlers), the project features a live 3D credit card preview, real-time validation, multi-currency switching, a fully upgraded Net Banking section with real bank logos, UPI support, and a polished success receipt screen.

This project was built as a **frontend portfolio piece** to demonstrate deep understanding of animation, form UX, responsive design, and real-world payment flows.

---

## 🌐 Live Demo

🔗 **[https://secure-pay-theta.vercel.app/](https://secure-pay-theta.vercel.app/)**

---

## ✨ Features

- 💳 **3D Card Preview** — Live flip, tilt, and real-time card data sync as you type
- 🔍 **Network Auto-Detection** — Detects Visa, Mastercard, Amex, Discover, RuPay from card number
- ✅ **Real-time Validation** — Inline errors, valid/error border states, expiry date logic
- 🏦 **Net Banking — Fully Upgraded** — 18 banks, real logos, search, category tabs, session timer
- ⏱️ **Session Countdown Timer** — 10-minute animated SVG arc timer with urgent red pulse
- 🔄 **Redirect Simulation** — Animated progress bar + bank logo redirect overlay
- 📱 **UPI Payment Tab** — UPI ID input + GPay / PhonePe / Paytm / BHIM quick-select
- 💰 **Multi-Currency Support** — Switch between USD, EUR, GBP, INR, JPY with live amount update
- 🧾 **Receipt Screen** — Auto-populated transaction receipt with print/download option
- 🃏 **Saved Cards** — Quick-fill form by clicking a saved card
- 🌐 **Fully Responsive** — Mobile, tablet, landscape, and desktop all handled
- 🎆 **Three.js Background** — Floating coins, candlestick chart, network nodes, particle drift

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Custom styling, animations, CSS variables |
| **JavaScript (ES6+)** | All interactivity, validation, and dynamic UI logic |
| **Three.js r128** | 3D animated banking-themed particle background |
| **GSAP 3.12.2** | All UI animations — entry reveals, card tilt, tab transitions |
| **GSAP ScrollTrigger** | Scroll-linked animation proxy |
| **Locomotive Scroll 4.1.4** | Smooth scroll (desktop only) |
| **Bootstrap 5.3** | Responsive grid utilities |
| **Google Fonts** | Syne (display) + Space Mono (monospace) |
| **Clearbit Logo API** | Real bank logos fetched via official bank domains |
| **Vercel** | Hosting and deployment |

---

## 📄 Pages & Sections

The website is a **single-page application (SPA)** with a two-column checkout layout:

```
/ (index.html)
├── Left Column
│   ├── Brand Bar           → SecurePay logo & name
│   ├── Order Summary       → Amount, line items, currency selector
│   ├── 3D Card Preview     → Live animated card (front + back)
│   └── Saved Cards         → Quick-fill saved card list
│
└── Right Column (Form Panel)
    ├── #tab-card           → Card payment form
    ├── #tab-upi            → UPI ID + app buttons
    ├── #tab-netbank        → Net Banking (fully upgraded)
    └── #successOverlay     → Payment success + receipt
```

---

## 💳 Payment Methods

### Card Flow
```
Enter card number → Network detected → Name / Expiry / CVV → Pay → Receipt ✓
```

### Net Banking Flow
```
Click Net Banking → Timer starts (10:00) → Search or browse banks
→ Select bank → Continue → Redirect animation → Success screen ✓
```

### UPI Flow
```
Enter UPI ID  OR  tap GPay / PhonePe / Paytm / BHIM → Pay ✓
```

---

## 🎨 Design

The entire UI is designed in **pure CSS** with a dark luxury fintech aesthetic.

- 🎯 Design Language: **Dark glassmorphism** — deep navy base, purple-violet accents, gold highlights
- 🖋️ Typography: **Syne** for headings (bold, geometric) + **Space Mono** for card numbers and code
- 🎨 Color Palette: `#08080f` background · `#5b6ef5` accent · `#e05aff` secondary · `#d4a843` gold · `#00c896` green
- ✨ Visual FX: Glow blobs, shimmer on card, Three.js particle canvas, backdrop blur panels
- 🏦 Bank Logos: Fetched live via **[Clearbit Logo API](https://clearbit.com/logo)** — shown on white pill background for clarity on dark theme

---

## 📁 Project Structure

```
securepay/
│
├── index.html          # Main HTML — layout, card markup, all payment tabs
├── style.css           # All styles — layout, card, form, net banking, responsive
├── script.js           # All JS — Three.js, GSAP, validation, net banking logic
│
└── assets/             # Static assets
    └── favicon.png      # Project favicon
```

> ⚡ No build tools. No npm. No bundler. Pure vanilla — clone and run.

---

## 🚀 Getting Started

No dependencies required. Just clone and open with a local server.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/securepay-checkout.git
```

### 2. Navigate to the Project Folder

```bash
cd securepay-checkout
```

### 3. Open with a Local Server

> ⚠️ Do **not** open `index.html` directly via `file://` — bank logos from Clearbit CDN require HTTP.

```bash
# Option A — VS Code Live Server (Recommended)
# Right-click index.html → Open with Live Server

# Option B — Python
python -m http.server 3000

# Option C — Node.js
npx serve .
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📱 Responsiveness

| Breakpoint | Target | Layout |
|---|---|---|
| `> 980px` | Desktop | Two-column side-by-side |
| `861–980px` | Large tablet | Tighter two-column |
| `≤ 860px` | iPad / tablet | Single-column stacked |
| `≤ 600px` | Large phones | 2-col bank grid, compact forms |
| `≤ 400px` | Small phones | Minimum sizes, 2-col grid |
| Landscape `h < 500px` | Rotated phones | Side-by-side re-enabled, non-essential sections hidden |

**Mobile-specific behaviour:**
- 🚫 Locomotive Scroll disabled on touch — native scroll used
- 🚫 Card 3D tilt disabled on touch — tap-to-flip gesture added instead
- ⚡ Three.js particles reduced 200 → 80 for mobile GPU performance

---

## 📬 Contact

For any queries, feedback, or collaboration:

[![Email](https://img.shields.io/badge/Email-toanshumansahu@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:toanshumansahu@gmail.com) <br>
[![Phone](https://img.shields.io/badge/Phone-+91_78549_39308-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+917854939308) <br>
[![GitHub](https://img.shields.io/badge/GitHub-anshuman--sahu--dev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anshuman-sahu-dev) <br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anshuman_Sahu-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anshuman-sahu-371a6535b/) <br>

## 📜 License

© 2026 **WanderFramez\_**. All rights reserved.

> *"Every great product starts with a great checkout experience."* 💳

---

## 👨‍💻 Developer

<div align="center">

### ✨ Made with ❤️ by

# 👨‍💻 Anshuman Sahu

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=1000&color=5b6ef5&center=true&vCenter=true&width=435&lines=Front-End+Developer;UI+%2F+UX+Enthusiast;HTML+%7C+CSS+%7C+JavaScript;Building+one+project+at+a+time+%F0%9F%9A%80)

---

📧 **Email:** toanshumansahu@gmail.com
📞 **Phone:** +91 78549 39308

---

[![GitHub](https://img.shields.io/badge/GitHub-anshuman--sahu--dev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anshuman-sahu-dev)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://securepay-checkout.vercel.app/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](#)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](#)

---

![Profile Views](https://komarev.com/ghpvc/?username=anshuman-sahu-dev&color=5b6ef5&style=for-the-badge&label=PROFILE+VIEWS)

</div>
