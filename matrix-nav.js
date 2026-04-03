// MATRIX NAV ENGINE - ZERO TOUCH INTEGRATION

(function () {
  const effects = [
    "fade", "zoom", "glitch", "rotate3d", "wipe",
    "flash", "blur", "matrix", "slice", "spin"
  ];

  function randEffect() {
    return effects[Math.floor(Math.random() * effects.length)];
  }

  // Inject CSS dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    .mx-overlay {
      position: fixed;
      top:0; left:0;
      width:100%; height:100%;
      background:#000;
      z-index:999999;
      pointer-events:none;
      opacity:0;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#0f0;
      font-family: monospace;
      font-size:20px;
      letter-spacing:2px;
    }

    .mx-overlay.active { opacity:1; }

    .mx-fade { animation: mxFade 0.8s forwards; }
    @keyframes mxFade { to { opacity:1; } }

    .mx-zoom { animation: mxZoom 0.8s forwards; }
    @keyframes mxZoom {
      from { transform: scale(1); }
      to { transform: scale(2); opacity:0; }
    }

    .mx-rotate3d { animation: mxRotate3d 0.8s forwards; }
    @keyframes mxRotate3d {
      to { transform: rotateY(90deg); opacity:0; }
    }

    .mx-glitch { animation: mxGlitch 0.5s; }
    @keyframes mxGlitch {
      20% { transform: translate(-5px,5px); }
      40% { transform: translate(5px,-5px); }
      60% { transform: translate(-3px,3px); }
      80% { transform: translate(3px,-3px); }
    }

    .mx-wipe { animation: mxWipe 0.8s forwards; }
    @keyframes mxWipe {
      from { height:0; }
      to { height:100%; }
    }

    .mx-flash { animation: mxFlash 0.5s forwards; }
    @keyframes mxFlash {
      0% { background:#fff; }
      100% { background:#000; }
    }

    .mx-blur { animation: mxBlur 0.8s forwards; }
    @keyframes mxBlur {
      to { filter: blur(10px); opacity:0; }
    }

    .mx-spin { animation: mxSpin 0.8s forwards; }
    @keyframes mxSpin {
      to { transform: rotate(360deg) scale(0); opacity:0; }
    }

    .mx-slice { animation: mxSlice 0.8s forwards; }
    @keyframes mxSlice {
      from { clip-path: inset(0 0 100% 0); }
      to { clip-path: inset(0 0 0 0); }
    }

    .mx-matrix::after {
      content:"010101010101010101";
      position:absolute;
      color:#0f0;
      animation: mxMatrix 0.8s linear forwards;
    }
    @keyframes mxMatrix {
      from { transform: translateY(-100%); }
      to { transform: translateY(100%); }
    }
  `;
  document.head.appendChild(style);

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "mx-overlay";
  overlay.innerHTML = "> LOADING...";
  document.body.appendChild(overlay);

  function playSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 120;
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  function go(url) {
    const effect = randEffect();
    overlay.className = "mx-overlay active mx-" + effect;

    playSound();

    setTimeout(() => {
      window.location.href = url;
    }, 700);
  }

  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank") return;

    e.preventDefault();
    go(href);
  });

})();
