(function() {
  let isTransitioning = false;
  let overlay = null;
  let canvas = null;
  let ctx = null;
  let animationId = null;
  let drops = [];
  let columns = 0;
  
  const chars = "01ONNWORKLAB";
  const fontSize = 18;
  
  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "#000000";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.2s ease";
    
    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
    ctx = canvas.getContext("2d");
    return overlay;
  }
  
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height * 0.8;
    }
  }
  
  function drawRain() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#33ff99";
    ctx.shadowColor = "#33ff99";
    ctx.shadowBlur = 5;
    ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const isHead = Math.abs(drops[i] - Math.floor(drops[i])) < 0.3;
      if (isHead) {
        ctx.fillStyle = "#88ffaa";
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = "#33ff99";
        ctx.shadowBlur = 4;
      }
      ctx.fillText(text, x, y);
      drops[i] += 0.65;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      } else if (drops[i] * fontSize > canvas.height) {
        drops[i] = 0;
      }
    }
    ctx.shadowBlur = 0;
  }
  
  function startRain() {
    resizeCanvas();
    overlay.style.opacity = "1";
    function animate() {
      drawRain();
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }
  
  function stopRain() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (overlay) overlay.style.opacity = "0";
  }
  
  function removeOverlay() {
    if (overlay && overlay.parentNode) {
      overlay.remove();
      overlay = null;
      canvas = null;
      ctx = null;
    }
  }
  
  function navigateWithTransition(url) {
    if (isTransitioning) return;
    isTransitioning = true;
    createOverlay();
    startRain();
    setTimeout(() => {
      stopRain();
      window.location.href = url;
      setTimeout(() => {
        removeOverlay();
        isTransitioning = false;
      }, 100);
    }, 3000);
  }
  
  function handleLinkClick(event) {
    const target = event.target.closest("a");
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href || href === "" || href.startsWith("#") || href.startsWith("javascript:")) return;
    const isExternal = target.target === "_blank" || 
                      (href.startsWith("http") && !href.includes(window.location.hostname));
    if (isExternal) return;
    if (target.hasAttribute("download") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    event.preventDefault();
    event.stopPropagation();
    navigateWithTransition(href);
  }
  
  window.addEventListener("resize", function() {
    if (overlay && overlay.style.opacity === "1") {
      resizeCanvas();
    }
  });
  
  document.addEventListener("click", handleLinkClick);
  
  window.addEventListener("popstate", function() {
    window.location.reload();
  });
  
  console.log("🎬 CINEMATIC MATRIX TRANSITION | 3-second rain effect active");
})();
