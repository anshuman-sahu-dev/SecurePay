/* ================================================================
   script.js — SecurePay Checkout
   Features: Three.js banking bg · Locomotive Scroll · GSAP ·
   Card tilt · Real-time validation · Card theme switch ·
   Network logo swap · Saved cards · Loading state · Receipt
   ================================================================ */

/* ================================================================
   1. THREE.JS — Banking-themed 3D particle background
   ================================================================ */
(function initThree() {
  const canvas = document.getElementById("three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    300,
  );
  camera.position.z = 70;

  // Materials
  const goldMat = new THREE.MeshBasicMaterial({
    color: 0xd4a843,
    transparent: true,
    opacity: 0.5,
  });
  const silverMat = new THREE.MeshBasicMaterial({
    color: 0x8fa3bf,
    transparent: true,
    opacity: 0.38,
  });
  const greenMat = new THREE.MeshBasicMaterial({
    color: 0x00c896,
    transparent: true,
    opacity: 0.55,
  });
  const redMat = new THREE.MeshBasicMaterial({
    color: 0xe05a5a,
    transparent: true,
    opacity: 0.55,
  });
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x3a5aad,
    transparent: true,
    opacity: 0.22,
  });
  const nodeMat = new THREE.MeshBasicMaterial({
    color: 0x5b6ef5,
    transparent: true,
    opacity: 0.5,
  });
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xe05aff,
    transparent: true,
    opacity: 0.38,
  });
  const trendMat = new THREE.MeshBasicMaterial({
    color: 0x00c896,
    transparent: true,
    opacity: 0.42,
  });

  // A) Floating coin discs
  const coins = [];
  const coinData = [
    [-50, 20, -30, 3.5, goldMat, 0.3, 0.1],
    [42, -15, -20, 2.8, silverMat, 0.5, 0.2],
    [-20, 35, -50, 4.0, goldMat, 0.2, -0.1],
    [60, 10, -40, 2.2, silverMat, 0.6, 0.3],
    [5, -40, -25, 3.0, goldMat, 0.4, -0.2],
    [-40, -30, -60, 2.5, silverMat, 0.1, 0.4],
    [30, 50, -35, 3.2, goldMat, 0.7, 0.1],
  ];
  coinData.forEach(([x, y, z, r, mat, rx, rz]) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, 0.25, 32),
      mat,
    );
    mesh.position.set(x, y, z);
    mesh.rotation.x = rx;
    mesh.rotation.z = rz;
    mesh.userData = { originY: y };
    scene.add(mesh);
    coins.push(mesh);
  });

  // B) Candlestick bars (stock chart)
  const bars = [];
  const barH = [18, 22, 15, 28, 20, 35, 12, 42, 30, 25, 38, 20, 45, 32, 28];
  for (let i = 0; i < 15; i++) {
    const h = barH[i];
    const x = -65 + i * 10;
    const mat = i % 3 === 0 ? redMat : greenMat;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(3.5, h, 1.2), mat);
    mesh.position.set(x, -50 + h / 2, -80);
    mesh.userData = { phase: i * 0.4 };
    scene.add(mesh);
    bars.push(mesh);
  }

  // C) Network nodes + lines
  const nodePos = [
    [-55, 25, -45],
    [-25, 45, -55],
    [10, 30, -50],
    [45, 48, -45],
    [60, 20, -55],
    [30, -10, -50],
    [-10, -5, -45],
    [-40, 10, -55],
    [15, 60, -60],
    [-20, -30, -50],
    [50, -25, -55],
  ];
  const nodeMeshes = [];
  nodePos.forEach(([x, y, z], i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 16, 16),
      i % 3 === 0 ? glowMat : nodeMat,
    );
    mesh.position.set(x, y, z);
    mesh.userData = { phase: i * 0.7 };
    scene.add(mesh);
    nodeMeshes.push(mesh);
  });
  nodePos.forEach(([x1, y1, z1], i) => {
    nodePos
      .map(([x2, y2, z2], j) => ({
        j,
        d: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2),
      }))
      .filter((d) => d.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        if (j > i) {
          const [x2, y2, z2] = nodePos[j];
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(x2, y2, z2),
          ]);
          scene.add(new THREE.Line(geo, lineMat));
        }
      });
  });

  // D) Trend line (bull market curve)
  const tPts = [];
  for (let i = 0; i <= 40; i++) {
    tPts.push(
      new THREE.Vector3(
        -60 + i * 3,
        -35 + Math.pow(i / 40, 2) * 40 + Math.sin(i * 0.5) * 4,
        -65,
      ),
    );
  }
  scene.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(tPts),
        60,
        0.3,
        8,
        false,
      ),
      trendMat,
    ),
  );

  // E) Currency particles
  const pCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  const palette = [
    new THREE.Color(0xd4a843),
    new THREE.Color(0x8fa3bf),
    new THREE.Color(0x5b6ef5),
  ];
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 140;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    const c = palette[Math.floor(Math.random() * 3)];
    pCol[i * 3] = c.r;
    pCol[i * 3 + 1] = c.g;
    pCol[i * 3 + 2] = c.b;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.55,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(particles);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    coins.forEach((c, i) => {
      c.position.y =
        c.userData.originY + Math.sin(t * 80 * (0.008 + i * 0.001)) * 2;
      c.rotation.y += 0.004;
    });
    bars.forEach((b) => {
      b.scale.y = 1 + Math.sin(t * 0.8 + b.userData.phase) * 0.04;
    });
    nodeMeshes.forEach((n) => {
      n.position.y += Math.sin(t * 0.1 + n.userData.phase) * 0.01;
    });
    const pa = particles.geometry.attributes.position.array;
    for (let i = 1; i < pCount * 3; i += 3) {
      pa[i] += 0.015;
      if (pa[i] > 50) pa[i] = -50;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    scene.rotation.y = Math.sin(t * 0.08) * 0.07;
    scene.rotation.x = Math.sin(t * 0.05) * 0.025;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ================================================================
   2. LOCOMOTIVE SCROLL + GSAP SCROLLTRIGGER
   ================================================================ */
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#scroll-container"),
  smooth: true,
  multiplier: 0.8,
});
gsap.registerPlugin(ScrollTrigger);
locoScroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy("#scroll-container", {
  scrollTop(v) {
    return arguments.length
      ? locoScroll.scrollTo(v, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.querySelector("#scroll-container").style.transform
    ? "transform"
    : "fixed",
});
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

/* ================================================================
   3. GSAP ENTRY ANIMATIONS
   ================================================================ */
gsap.set(["#leftCol", "#rightCol"], { opacity: 0, y: 40 });
gsap.to("#leftCol", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
  delay: 0.2,
});
gsap.to("#rightCol", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
  delay: 0.45,
});

// Card float
gsap.to("#cardScene", {
  y: "-=8",
  repeat: -1,
  yoyo: true,
  duration: 2.8,
  ease: "sine.inOut",
  delay: 1.2,
});

/* ================================================================
   4. CARD 3D TILT ON MOUSE MOVE (Stripe-style parallax tilt)
      The card tilts slightly toward the cursor — premium feel
   ================================================================ */
const cardScene = document.getElementById("cardScene");
const cardFlipper = document.getElementById("cardFlipper");
let isTilting = true;
let isFlipped = false;

cardScene.addEventListener("mousemove", function (e) {
  if (!isTilting) return;
  const rect = cardScene.getBoundingClientRect();
  // Map cursor position to -1..1 range
  const xRel = (e.clientX - rect.left) / rect.width - 0.5;
  const yRel = (e.clientY - rect.top) / rect.height - 0.5;
  // Max tilt = ±12 degrees
  const rotY = xRel * 12;
  const rotX = -yRel * 10;
  const baseY = isFlipped ? 180 : 0;
  gsap.to(cardFlipper, {
    rotateY: baseY + rotY,
    rotateX: rotX,
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto",
  });
});

cardScene.addEventListener("mouseleave", function () {
  if (!isTilting) return;
  const baseY = isFlipped ? 180 : 0;
  gsap.to(cardFlipper, {
    rotateY: baseY,
    rotateX: 0,
    duration: 0.7,
    ease: "elastic.out(1, 0.5)",
  });
});

// Disable tilt when card is flipped (CVV focus)
function setTilt(on) {
  isTilting = on;
}

/* ================================================================
   5. PAYMENT METHOD TABS
   ================================================================ */
document.querySelectorAll(".pay-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    const target = this.dataset.tab;

    // Update active tab style
    document
      .querySelectorAll(".pay-tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    // Show correct content panel
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    document.getElementById("tab-" + target).classList.add("active");

    // Animate panel in
    gsap.fromTo(
      "#tab-" + target,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );
  });
});

/* ================================================================
   6. POPULATE SELECTS
   ================================================================ */
const monthSelect = document.getElementById("inputMonth");
for (let m = 1; m <= 12; m++) {
  const o = document.createElement("option");
  o.value = m < 10 ? "0" + m : "" + m;
  o.textContent = m < 10 ? "0" + m : "" + m;
  monthSelect.appendChild(o);
}

const yearSelect = document.getElementById("inputYear");
const currentYear = new Date().getFullYear();
for (let y = 0; y < 12; y++) {
  const o = document.createElement("option");
  o.value = currentYear + y;
  o.textContent = currentYear + y;
  yearSelect.appendChild(o);
}

/* ================================================================
   7. CARD NUMBER — Format, detect network, switch logo + theme
   ================================================================ */
const inputNumber = document.getElementById("inputNumber");
const cardTypeIcon = document.getElementById("cardTypeIcon");

// All network logo SVGs
const logoMap = {
  visa: document.getElementById("logo-visa"),
  mc: document.getElementById("logo-mc"),
  amex: document.getElementById("logo-amex"),
  discover: document.getElementById("logo-discover"),
  rupay: document.getElementById("logo-rupay"),
};

const groups = ["g1", "g2", "g3", "g4"].map((id) =>
  document.getElementById(id),
);
const networkLogoBack = document.getElementById("networkLogoBack");
const cardFrontEl = document.getElementById("cardFront");

let currentNetwork = "visa";

// Map network → card background theme class, icon, back label
const networkConfig = {
  visa: { theme: "theme-visa", icon: "💳", backLabel: "VISA" },
  mc: { theme: "theme-mc", icon: "🟠", backLabel: "MC" },
  amex: { theme: "theme-amex", icon: "🌟", backLabel: "AMEX" },
  discover: { theme: "theme-discover", icon: "🔶", backLabel: "DISCOVER" },
  rupay: { theme: "theme-rupay", icon: "🔵", backLabel: "RuPay" },
};

function detectNetwork(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits)) return "mc";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6011/.test(digits)) return "discover";
  if (/^6[0-9]{15}/.test(digits)) return "rupay";
  return "visa";
}

function switchNetwork(net) {
  if (net === currentNetwork) return;
  currentNetwork = net;

  // Hide all logos, show correct one
  Object.values(logoMap).forEach((el) => el.classList.add("hidden"));
  logoMap[net].classList.remove("hidden");

  // Animate logo
  gsap.fromTo(
    logoMap[net],
    { scale: 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
  );

  // Switch card background theme
  cardFrontEl.className = "card-face card-front theme-" + net;

  // Update icon
  cardTypeIcon.textContent = networkConfig[net].icon;

  // Update back label
  networkLogoBack.textContent = networkConfig[net].backLabel;
}

inputNumber.addEventListener("input", function () {
  let digits = this.value.replace(/\D/g, "").slice(0, 16);
  this.value = digits.match(/.{1,4}/g)?.join(" ") || digits;

  // Update 4 groups on card visual
  for (let i = 0; i < 4; i++) {
    let chunk = digits.slice(i * 4, i * 4 + 4).padEnd(4, "#");
    if ((i === 1 || i === 2) && digits.length > i * 4)
      chunk = chunk.replace(/\d/g, "★");
    groups[i].textContent = chunk;
    gsap.fromTo(
      groups[i],
      { y: -5, opacity: 0.3 },
      { y: 0, opacity: 1, duration: 0.22, ease: "back.out" },
    );
  }

  switchNetwork(detectNetwork(digits));
  validateField("number");
});

/* ================================================================
   8. REAL-TIME FIELD VALIDATION
      Shows inline error messages + valid/error border states
   ================================================================ */

function setFieldState(inputEl, errorEl, valid, msg) {
  inputEl.classList.toggle("valid", valid);
  inputEl.classList.toggle("error", !valid && msg !== "");
  errorEl.textContent = valid ? "" : msg;
}

function validateField(field) {
  switch (field) {
    case "number": {
      const digits = inputNumber.value.replace(/\s/g, "");
      const err = document.getElementById("err-number");
      if (digits.length === 0) setFieldState(inputNumber, err, false, "");
      else if (digits.length < 16)
        setFieldState(
          inputNumber,
          err,
          false,
          "Card number must be 16 digits.",
        );
      else setFieldState(inputNumber, err, true, "");
      break;
    }
    case "name": {
      const val = inputName.value.trim();
      const err = document.getElementById("err-name");
      if (val.length === 0) setFieldState(inputName, err, false, "");
      else if (val.length < 3)
        setFieldState(inputName, err, false, "Enter the full name as on card.");
      else if (/\d/.test(val))
        setFieldState(
          inputName,
          err,
          false,
          "Name should not contain numbers.",
        );
      else setFieldState(inputName, err, true, "");
      break;
    }
    case "cvv": {
      const val = inputCvv.value;
      const err = document.getElementById("err-cvv");
      const required = currentNetwork === "amex" ? 4 : 3;
      if (val.length === 0) setFieldState(inputCvv, err, false, "");
      else if (val.length < required)
        setFieldState(inputCvv, err, false, `CVV must be ${required} digits.`);
      else setFieldState(inputCvv, err, true, "");
      break;
    }
    case "month": {
      const err = document.getElementById("err-month");
      if (!monthSelect.value) {
        err.textContent = "";
        return;
      }
      const now = new Date();
      const selY = parseInt(yearSelect.value) || 0;
      const selM = parseInt(monthSelect.value) || 0;
      if (selY === now.getFullYear() && selM < now.getMonth() + 1) {
        err.textContent = "Card is expired.";
      } else {
        err.textContent = "";
      }
      break;
    }
  }
}

// Attach validation listeners
const inputName = document.getElementById("inputName");
const inputCvv = document.getElementById("inputCvv");

inputName.addEventListener("input", () => {
  cardNameDisplay.textContent =
    inputName.value.trim().toUpperCase() || "FULL NAME";
  gsap.fromTo(cardNameDisplay, { opacity: 0.4 }, { opacity: 1, duration: 0.2 });
  validateField("name");
});

inputCvv.addEventListener("input", () => {
  cvvDisplay.textContent = "•".repeat(inputCvv.value.length) || "•••";
  validateField("cvv");
});

monthSelect.addEventListener("change", () => {
  updateExpiry();
  validateField("month");
});
yearSelect.addEventListener("change", () => {
  updateExpiry();
  validateField("month");
});

inputNumber.addEventListener("blur", () => validateField("number"));
inputName.addEventListener("blur", () => validateField("name"));
inputCvv.addEventListener("blur", () => validateField("cvv"));

/* ================================================================
   9. CARD DISPLAY SYNC (name, date, CVV)
   ================================================================ */
const cardNameDisplay = document.getElementById("cardNameDisplay");
const cardDateDisplay = document.getElementById("cardDateDisplay");
const cvvDisplay = document.getElementById("cvvDisplay");
const flipper = document.getElementById("cardFlipper");

function updateExpiry() {
  const m = monthSelect.value || "MM";
  const y = yearSelect.value ? String(yearSelect.value).slice(2) : "YY";
  cardDateDisplay.textContent = `${m} / ${y}`;
  gsap.fromTo(
    cardDateDisplay,
    { y: 7, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" },
  );
}

// CVV flips card to show back — use GSAP to avoid conflict with tilt transform
function flipToBack() {
  if (isFlipped) return;
  isFlipped = true;
  setTilt(false);
  gsap.to(cardFlipper, {
    rotateY: 180,
    rotateX: 0,
    duration: 0.75,
    ease: "cubic-bezier(0.4,0.2,0.2,1)",
    overwrite: true,
  });
}

function flipToFront() {
  if (!isFlipped) return;
  isFlipped = false;
  gsap.to(cardFlipper, {
    rotateY: 0,
    rotateX: 0,
    duration: 0.75,
    ease: "cubic-bezier(0.4,0.2,0.2,1)",
    overwrite: true,
    onComplete: () => setTimeout(() => setTilt(true), 50),
  });
}

inputCvv.addEventListener("focus", flipToBack);
inputCvv.addEventListener("blur", flipToFront);

/* ================================================================
   10. FOCUS RING (highlights matching region on card)
   ================================================================ */
const focusRing = document.getElementById("focusRing");
const cardFrontEl2 = document.querySelector(".card-front");

const refMap = {
  number: document.getElementById("cardNumDisplay"),
  name: document.getElementById("cardNameBlock"),
  date: document.getElementById("cardDateBlock"),
};

function showFocusRing(el) {
  if (!el) {
    focusRing.classList.remove("visible");
    return;
  }
  const cr = cardFrontEl2.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  focusRing.style.top = er.top - cr.top - 6 + "px";
  focusRing.style.left = er.left - cr.left - 8 + "px";
  focusRing.style.width = er.width + 16 + "px";
  focusRing.style.height = er.height + 12 + "px";
  focusRing.classList.add("visible");
}

document.querySelectorAll("[data-ref]").forEach((input) => {
  input.addEventListener("focus", function () {
    const ref = this.dataset.ref;
    if (ref === "cvv") {
      focusRing.classList.remove("visible");
      return;
    }
    showFocusRing(refMap[ref]);
  });
  input.addEventListener("blur", function () {
    setTimeout(() => {
      if (
        !document.activeElement.dataset.ref ||
        document.activeElement === inputCvv
      )
        focusRing.classList.remove("visible");
    }, 150);
  });
});

/* ================================================================
   11. SAVED CARDS — Quick-fill form by clicking a saved card
   ================================================================ */
document.querySelectorAll(".saved-card").forEach((card) => {
  card.addEventListener("click", function () {
    // Remove active from all
    document
      .querySelectorAll(".saved-card")
      .forEach((c) => c.classList.remove("active-saved"));
    this.classList.add("active-saved");

    const num = this.dataset.num;
    const name = this.dataset.name;
    const expM = this.dataset.expM;
    const expY = this.dataset.expY;
    const type = this.dataset.type;

    // Fill inputs with saved data
    inputNumber.value = num.replace(/.{4}/g, "$& ").trim();
    inputName.value = name;
    monthSelect.value = expM;
    yearSelect.value = expY;

    // Trigger card display updates
    inputNumber.dispatchEvent(new Event("input"));
    inputName.dispatchEvent(new Event("input"));
    updateExpiry();
    switchNetwork(type);

    // GSAP card bounce to signal fill
    gsap.fromTo(
      "#cardScene",
      { scale: 0.97 },
      { scale: 1, duration: 0.4, ease: "back.out(2)" },
    );
  });
});

/* ================================================================
   12. CURRENCY SELECTOR — updates amount display
   ================================================================ */
const currencySelect = document.getElementById("currencySelect");
const amountDisplay = document.getElementById("amountDisplay");
const btnAmount = document.getElementById("btnAmount");

currencySelect.addEventListener("change", function () {
  const symbol = this.value;
  const amounts = {
    $: "249.00",
    "€": "229.00",
    "£": "197.00",
    "₹": "20,750",
    "¥": "37,200",
  };
  const val = amounts[symbol] || "249.00";
  amountDisplay.textContent = val;
  btnAmount.textContent = symbol + val;
  gsap.fromTo(
    amountDisplay,
    { scale: 0.9, opacity: 0.4 },
    { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" },
  );
});

/* ================================================================
   13. SUBMIT — Validate all, show loader, then show receipt
   ================================================================ */
document.getElementById("btnSubmit").addEventListener("click", function () {
  const num = inputNumber.value.replace(/\s/g, "");
  const name = inputName.value.trim();
  const mon = monthSelect.value;
  const yr = yearSelect.value;
  const cvv = inputCvv.value;
  const reqCvv = currentNetwork === "amex" ? 4 : 3;

  // Run all validations
  validateField("number");
  validateField("name");
  validateField("cvv");
  validateField("month");

  const isValid =
    num.length === 16 &&
    name.length >= 3 &&
    !/\d/.test(name) &&
    mon &&
    yr &&
    cvv.length >= reqCvv;

  if (!isValid) {
    // Shake the panel
    gsap.to("#formPanel", {
      x: -12,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
      onComplete: () => gsap.set("#formPanel", { x: 0 }),
    });
    // Scroll to first error
    const firstError = document.querySelector(".field-error:not(:empty)");
    if (firstError)
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // ── Show loading state ──
  const btn = document.getElementById("btnSubmit");
  btn.classList.add("loading");
  document.getElementById("btnText").classList.add("hidden");
  document.getElementById("btnLoader").classList.remove("hidden");

  // Simulate a payment gateway processing delay (1.8s)
  setTimeout(() => {
    // Populate receipt
    document.getElementById("txnId").textContent =
      "TXN" + Date.now().toString().slice(-8).toUpperCase();
    document.getElementById("txnAmount").textContent =
      document.getElementById("btnAmount").textContent;
    document.getElementById("txnCard").textContent =
      currentNetwork.toUpperCase() + " •••• " + num.slice(-4);
    document.getElementById("txnDate").textContent = new Date().toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );

    // Hide form, show success
    gsap.to("#formContent", {
      opacity: 0,
      y: -16,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        document.getElementById("formContent").style.display = "none";
        const overlay = document.getElementById("successOverlay");
        overlay.classList.add("show");
        gsap.fromTo(
          overlay,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
        );
      },
    });

    // Card celebration flip (GSAP-driven to stay consistent)
    gsap.to(cardFlipper, {
      rotateY: 180,
      duration: 0.5,
      ease: "power2.inOut",
      overwrite: true,
    });
    setTimeout(
      () =>
        gsap.to(cardFlipper, {
          rotateY: 0,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: true,
        }),
      900,
    );
  }, 1800);
});

/* ================================================================
   NET BANKING — Full Featured Upgrade
   ================================================================ */
(function initNetBanking() {
  /* ── Bank data ── */
  const BANKS = [
    // popular
    {
      id: "sbi",
      name: "SBI",
      fullName: "State Bank of India",
      emoji: "🏦",
      color: "#1a3a6b",
      cat: ["popular", "public"],
    },
    {
      id: "hdfc",
      name: "HDFC",
      fullName: "HDFC Bank",
      emoji: "🔵",
      color: "#004c97",
      cat: ["popular", "private"],
    },
    {
      id: "icici",
      name: "ICICI",
      fullName: "ICICI Bank",
      emoji: "🟠",
      color: "#8b1a2e",
      cat: ["popular", "private"],
    },
    {
      id: "axis",
      name: "Axis",
      fullName: "Axis Bank",
      emoji: "🟣",
      color: "#97144d",
      cat: ["popular", "private"],
    },
    {
      id: "kotak",
      name: "Kotak",
      fullName: "Kotak Mahindra",
      emoji: "🔴",
      color: "#e31837",
      cat: ["popular", "private"],
    },
    {
      id: "paytm",
      name: "Paytm",
      fullName: "Paytm Payments Bank",
      emoji: "💙",
      color: "#00b9f5",
      cat: ["popular", "private"],
    },
    // private
    {
      id: "indusind",
      name: "IndusInd",
      fullName: "IndusInd Bank",
      emoji: "🟢",
      color: "#005da4",
      cat: ["private"],
    },
    {
      id: "yes",
      name: "Yes Bank",
      fullName: "Yes Bank",
      emoji: "🔷",
      color: "#00529b",
      cat: ["private"],
    },
    {
      id: "idfc",
      name: "IDFC First",
      fullName: "IDFC First Bank",
      emoji: "🌀",
      color: "#f26522",
      cat: ["private"],
    },
    {
      id: "rbl",
      name: "RBL",
      fullName: "RBL Bank",
      emoji: "🔶",
      color: "#d4262c",
      cat: ["private"],
    },
    {
      id: "federal",
      name: "Federal",
      fullName: "Federal Bank",
      emoji: "🟡",
      color: "#002d6e",
      cat: ["private"],
    },
    {
      id: "csb",
      name: "CSB",
      fullName: "CSB Bank",
      emoji: "🔸",
      color: "#c8102e",
      cat: ["private"],
    },
    // public
    {
      id: "pnb",
      name: "PNB",
      fullName: "Punjab National Bank",
      emoji: "🏛",
      color: "#c41230",
      cat: ["public"],
    },
    {
      id: "bob",
      name: "Bank of Baroda",
      fullName: "Bank of Baroda",
      emoji: "🏦",
      color: "#f26522",
      cat: ["public"],
    },
    {
      id: "canara",
      name: "Canara",
      fullName: "Canara Bank",
      emoji: "🟤",
      color: "#006400",
      cat: ["public"],
    },
    {
      id: "union",
      name: "Union Bank",
      fullName: "Union Bank of India",
      emoji: "⚫",
      color: "#003087",
      cat: ["public"],
    },
    {
      id: "central",
      name: "Central",
      fullName: "Central Bank of India",
      emoji: "🔲",
      color: "#8b0000",
      cat: ["public"],
    },
    {
      id: "indian",
      name: "Indian Bank",
      fullName: "Indian Bank",
      emoji: "🔹",
      color: "#006400",
      cat: ["public"],
    },
  ];

  let selectedBank = null;
  let currentCat = "popular";
  let searchQuery = "";
  let timerInterval = null;
  let timerSeconds = 600; // 10 minutes

  const bankGrid = document.getElementById("bankGrid");
  const nbSearch = document.getElementById("nbSearch");
  const nbSearchClear = document.getElementById("nbSearchClear");
  const nbNoResults = document.getElementById("nbNoResults");
  const nbNoResultsTerm = document.getElementById("nbNoResultsTerm");
  const nbSelectedBar = document.getElementById("nbSelectedBar");
  const nbSelectedLogo = document.getElementById("nbSelectedLogo");
  const nbSelectedName = document.getElementById("nbSelectedName");
  const nbSelectedClearBtn = document.getElementById("nbSelectedClearBtn");
  const nbContinueBtn = document.getElementById("nbContinueBtn");
  const nbBtnText = document.getElementById("nbBtnText");
  const nbBtnLoader = document.getElementById("nbBtnLoader");
  const nbTimerCount = document.getElementById("nbTimerCount");
  const timerArc = document.getElementById("timerArc");
  const nbRedirectOverlay = document.getElementById("nbRedirectOverlay");
  const nbRedirectLogo = document.getElementById("nbRedirectLogo");
  const nbRedirectBankName = document.getElementById("nbRedirectBankName");
  const nbProgressBar = document.getElementById("nbProgressBar");
  const nbRedirectPct = document.getElementById("nbRedirectPct");

  /* ── Render bank grid ── */
  function renderBanks() {
    let filtered = BANKS.filter((b) => {
      const matchCat = currentCat === "all" || b.cat.includes(currentCat);
      const matchQ =
        !searchQuery ||
        b.name.toLowerCase().includes(searchQuery) ||
        b.fullName.toLowerCase().includes(searchQuery);
      return matchCat && matchQ;
    });

    bankGrid.innerHTML = "";

    if (filtered.length === 0) {
      nbNoResults.style.display = "block";
      nbNoResultsTerm.textContent = searchQuery;
      return;
    }
    nbNoResults.style.display = "none";

    filtered.forEach((bank, i) => {
      const btn = document.createElement("div");
      btn.className =
        "bank-btn" + (selectedBank?.id === bank.id ? " selected" : "");
      btn.style.position = "relative";
      btn.innerHTML = `
        <div class="bank-logo" style="background:${bank.color}20;border:1px solid ${bank.color}55">
          <span style="font-size:20px">${bank.emoji}</span>
        </div>
        <div class="bank-name-text">${bank.name}</div>
        <div class="bank-check">✓</div>
      `;
      btn.style.animationDelay = i * 0.03 + "s";
      btn.addEventListener("click", () => selectBank(bank));
      bankGrid.appendChild(btn);
    });
  }

  /* ── Select a bank ── */
  function selectBank(bank) {
    selectedBank = bank;

    // Bounce animation
    gsap.fromTo(
      "#bankGrid",
      { scale: 0.98 },
      { scale: 1, duration: 0.25, ease: "back.out(2)" },
    );

    // Show selected bar
    nbSelectedLogo.textContent = bank.emoji;
    nbSelectedName.textContent = bank.fullName + " selected ✓";
    nbSelectedBar.style.display = "flex";

    // Enable continue button
    nbContinueBtn.disabled = false;
    nbBtnText.textContent = `Continue to ${bank.name} →`;

    renderBanks();
  }

  /* ── Clear selection ── */
  function clearSelection() {
    selectedBank = null;
    nbSelectedBar.style.display = "none";
    nbContinueBtn.disabled = true;
    nbBtnText.textContent = "Select a Bank to Continue";
    renderBanks();
  }
  nbSelectedClearBtn.addEventListener("click", clearSelection);

  /* ── Category tabs ── */
  document.querySelectorAll(".nb-cat").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".nb-cat")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentCat = this.dataset.cat;
      searchQuery = "";
      nbSearch.value = "";
      nbSearchClear.style.display = "none";
      renderBanks();
    });
  });

  /* ── Search ── */
  nbSearch.addEventListener("input", function () {
    searchQuery = this.value.trim().toLowerCase();
    nbSearchClear.style.display = searchQuery ? "block" : "none";
    // auto-switch to 'all' when searching
    if (searchQuery) {
      document
        .querySelectorAll(".nb-cat")
        .forEach((b) => b.classList.remove("active"));
      document.querySelector('.nb-cat[data-cat="all"]').classList.add("active");
      currentCat = "all";
    }
    renderBanks();
  });
  nbSearchClear.addEventListener("click", () => {
    nbSearch.value = "";
    searchQuery = "";
    nbSearchClear.style.display = "none";
    renderBanks();
  });

  /* ── Continue button → redirect animation ── */
  nbContinueBtn.addEventListener("click", function () {
    if (!selectedBank || this.disabled) return;

    // Switch button to loader
    nbBtnText.classList.add("hidden");
    nbBtnLoader.classList.remove("hidden");
    this.classList.add("loading");
    this.disabled = true;

    // Short delay then show redirect overlay
    setTimeout(() => {
      nbRedirectLogo.innerHTML = `<span style="font-size:32px">${selectedBank.emoji}</span>`;
      nbRedirectLogo.style.background = selectedBank.color + "33";
      nbRedirectBankName.textContent = selectedBank.fullName;
      nbRedirectOverlay.classList.add("show");

      // Animate progress bar
      let pct = 0;
      const prog = setInterval(() => {
        pct += Math.random() * 8 + 3;
        if (pct >= 100) {
          pct = 100;
          clearInterval(prog);
        }
        nbProgressBar.style.width = pct + "%";
        nbRedirectPct.textContent = Math.round(pct) + "%";
      }, 180);

      // After "redirect" completes — show success (demo)
      setTimeout(() => {
        clearInterval(prog);
        nbProgressBar.style.width = "100%";
        nbRedirectPct.textContent = "100%";
        setTimeout(() => {
          nbRedirectOverlay.classList.remove("show");
          // Trigger main success overlay
          document.getElementById("txnId").textContent =
            "TXN" + Date.now().toString().slice(-8).toUpperCase();
          document.getElementById("txnAmount").textContent =
            document.getElementById("btnAmount")?.textContent || "$249.00";
          document.getElementById("txnCard").textContent =
            selectedBank.fullName + " — Net Banking";
          document.getElementById("txnDate").textContent =
            new Date().toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });
          const overlay = document.getElementById("successOverlay");
          document.getElementById("formContent") &&
            (document.getElementById("formContent").style.display = "none");
          overlay.classList.add("show");
          gsap.fromTo(
            overlay,
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.4)" },
          );
        }, 600);
      }, 3000);
    }, 700);
  });

  /* ── Session countdown timer ── */
  function startTimer() {
    timerSeconds = 600;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        nbTimerCount.textContent = "00:00";
        nbTimerCount.classList.add("urgent");
        nbContinueBtn.disabled = true;
        nbBtnText.textContent = "Session Expired — Refresh";
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (timerSeconds % 60).toString().padStart(2, "0");
    nbTimerCount.textContent = `${m}:${s}`;

    // Animate arc (stroke-dasharray = 100 total)
    const pct = (timerSeconds / 600) * 100;
    timerArc.setAttribute("stroke-dasharray", `${pct} 100`);

    // Turn red when < 60s
    if (timerSeconds <= 60) {
      nbTimerCount.classList.add("urgent");
      timerArc.style.stroke = "var(--red)";
    } else {
      nbTimerCount.classList.remove("urgent");
      timerArc.style.stroke = "var(--accent)";
    }
  }

  /* ── Start timer when Net Banking tab is clicked ── */
  document.querySelectorAll(".pay-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      if (this.dataset.tab === "netbank") {
        clearInterval(timerInterval);
        startTimer();
      } else {
        clearInterval(timerInterval);
      }
    });
  });

  /* ── Init ── */
  renderBanks();
})();
