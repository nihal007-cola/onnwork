javascript
// MATRIX NAV ENGINE - LETTER RAIN TRANSITION (3-second matrix effect)

(function() {
  // ============================================
  // LETTER RAIN TRANSITION - CLASSIC MATRIX EFFECT
  // ============================================
  let isTransitioning = false;
  let transitionOverlay = null;
  let transitionCanvas = null;
  let transitionCtx = null;
  let transitionAnimationId = null;
  let transitionDrops = [];
  let transitionColumns = 0;
  
  // Character set for the rain (same style as the background)
  const transitionLetters = "01ONNWORKLAB";
  const transitionFontSize = 18;
  
  // Create overlay element
  function createTransitionOverlay() {
    if (!transitionOverlay) {
      transitionOverlay = document.createElement("div");
      transitionOverlay.style.position = "fixed";
      transitionOverlay.style.top = "0";
      transitionOverlay.style.left = "0";
      transitionOverlay.style.width = "100%";
      transitionOverlay.style.height = "100%";
      transitionOverlay.style.backgroundColor = "#000000";
      transitionOverlay.style.zIndex = "9999";
      transitionOverlay.style.pointerEvents = "none";
      transitionOverlay.style.opacity = "0";
      transitionOverlay.style.transition = "opacity 0.2s ease";
      
      transitionCanvas = document.createElement("canvas");
      transitionCanvas.style.position = "absolute";
      transitionCanvas.style.top = "0";
      transitionCanvas.style.left = "0";
      transitionCanvas.style.width = "100%";
      transitionCanvas.style.height = "100%";
      
      transitionOverlay.appendChild(transitionCanvas);
      document.body.appendChild(transitionOverlay);
      transitionCtx = transitionCanvas.getContext("2d");
    }
    return transitionOverlay;
  }
  
  // Resize and reinitialize rain columns
  function resizeTransitionCanvas() {
    if (!transitionCanvas) return;
    transitionCanvas.width = window.innerWidth;
    transitionCanvas.height = window.innerHeight;
    transitionColumns = Math.floor(transitionCanvas.width / transitionFontSize);
    transitionDrops = [];
    for (let i = 0; i < transitionColumns; i++) {
      transitionDrops[i] = Math.random() * -transitionCanvas.height * 0.8;
    }
  }
  
  // Draw the matrix rain animation
  function drawTransitionRain() {
    if (!transitionCtx || !transitionCanvas) return;
    
    // Fade trail effect
    transitionCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
    transitionCtx.fillRect(0, 0, transitionCanvas.width, transitionCanvas.height);
    
    transitionCtx.fillStyle = "#33ff99";
    transitionCtx.shadowColor = "#33ff99";
    transitionCtx.shadowBlur = 5;
    transitionCtx.font = `bold ${transitionFontSize}px 'Courier New', monospace`;
    
    for (let i = 0; i < transitionDrops.length; i++) {
      const text = transitionLetters.charAt(Math.floor(Math.random() * transitionLetters.length));
      const x = i * transitionFontSize;
      const y = transitionDrops[i];
      
      // Brighter head of column
      const isHead = Math.abs(transitionDrops[i] - Math.floor(transitionDrops[i])) < 0.3;
      if (isHead) {
        transitionCtx.fillStyle = "#88ffaa";
        transitionCtx.shadowBlur = 10;
      } else {
        transitionCtx.fillStyle = "#33ff99";
        transitionCtx.shadowBlur = 4;
      }
      
      transitionCtx.fillText(text, x, y);
      
      // Move drop downward
      transitionDrops[i] += 0.65;
      
      // Reset when reaching bottom
      if (transitionDrops[i] * transitionFontSize > transitionCanvas.height && Math.random() > 0.975) {
        transitionDrops[i] = 0;
      } else if (transitionDrops[i] * transitionFontSize > transitionCanvas.height) {
        transitionDrops[i] = 0;
      }
    }
    transitionCtx.shadowBlur = 0;
  }
  
  // Start the rain animation
  function startTransitionRain() {
    resizeTransitionCanvas();
    transitionOverlay.style.opacity = "1";
    
    function animate() {
      drawTransitionRain();
      transitionAnimationId = requestAnimationFrame(animate);
    }
    animate();
  }
  
  // Stop and clean up
  function stopTransitionRain() {
    if (transitionAnimationId) {
      cancelAnimationFrame(transitionAnimationId);
      transitionAnimationId = null;
    }
    if (transitionOverlay) {
      transitionOverlay.style.opacity = "0";
    }
  }
  
  // Remove overlay completely after navigation
  function removeTransitionOverlay() {
    if (transitionOverlay && transitionOverlay.parentNode) {
      transitionOverlay.remove();
      transitionOverlay = null;
      transitionCanvas = null;
      transitionCtx = null;
    }
  }
  
  // Handle navigation with 3-second letter rain
  function navigateWithLetterRain(url) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    createTransitionOverlay();
    startTransitionRain();
    
    // 3 seconds of letter rain effect
    setTimeout(() => {
      stopTransitionRain();
      window.location.href = url;
    }, 3000);
  }
  
  // ============================================
  // INTERCEPT LINK CLICKS
  // ============================================
  function handleLinkClick(event) {
    const target = event.target.closest("a");
    if (!target) return;
    
    const href = target.getAttribute("href");
    if (!href || href === "" || href.startsWith("#") || href.startsWith("javascript:")) return;
    
    // Check if external link
    const isExternal = target.target === "_blank" || 
                      (href.startsWith("http") && !href.includes(window.location.hostname));
    
    if (isExternal) return;
    
    // Check if download, mailto, or tel
    if (target.hasAttribute("download") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    navigateWithLetterRain(href);
  }
  
  // Handle window resize during transition
  window.addEventListener("resize", function() {
    if (transitionOverlay && transitionOverlay.style.opacity === "1") {
      resizeTransitionCanvas();
    }
  });
  
  // Initialize event listener
  document.addEventListener("click", handleLinkClick);
  
  // Handle popstate (back/forward navigation)
  window.addEventListener("popstate", function() {
    window.location.reload();
  });
  
  // Pre-initialize styles
  const initStyles = document.createElement("style");
  initStyles.textContent = `
    * {
      -webkit-tap-highlight-color: transparent;
    }
    
    body {
      transition: none !important;
    }
    
    a {
      cursor: pointer;
    }
  `;
  document.head.appendChild(initStyles);
  
  // Log initialization
  console.log("🌧️ LETTER RAIN NAV ENGINE | 3-second matrix rain transition active 🌧️");
})();

