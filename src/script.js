(function () {
  const SIZE = 400; // viewBox units (logical)
  const DURATION = 3;
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // 2π/φ²
  const svgNS = "http://www.w3.org/2000/svg";
  const DOT_COLOR = "#7042D2";

  // Adaptive params by displayed size (px)
  function getParams(displaySize) {
    if (displaySize <= 32) {
      return { n: 45, dotRadius: 4, margin: 2 };
    }
    if (displaySize <= 64) {
      return { n: 80, dotRadius: 3, margin: 2 };
    }
    if (displaySize <= 120) {
      return { n: 150, dotRadius: 2.5, margin: 2 };
    }
    return { n: 600, dotRadius: 2, margin: 2 };
  }

  function buildSpiral(container, size) {
    const { n, dotRadius, margin } = getParams(size);
    const center = SIZE / 2;
    const maxRadius = center - margin - dotRadius;

    let svg = container.querySelector("svg");
    if (svg) svg.remove();

    svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    container.appendChild(svg);

    for (let i = 0; i < n; i++) {
      const idx = i + 0.5;
      const frac = idx / n;
      const r = Math.sqrt(frac) * maxRadius;
      const theta = idx * GOLDEN_ANGLE;
      const x = center + r * Math.cos(theta);
      const y = center + r * Math.sin(theta);

      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", dotRadius);
      svg.appendChild(c);

      const animR = document.createElementNS(svgNS, "animate");
      animR.setAttribute("attributeName", "r");
      animR.setAttribute(
        "values",
        `${dotRadius * 0.5};${dotRadius * 1.5};${dotRadius * 0.5}`
      );
      animR.setAttribute("dur", `${DURATION}s`);
      animR.setAttribute("begin", `${frac * DURATION}s`);
      animR.setAttribute("repeatCount", "indefinite");
      animR.setAttribute("calcMode", "spline");
      animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      c.appendChild(animR);

      const animO = document.createElementNS(svgNS, "animate");
      animO.setAttribute("attributeName", "opacity");
      animO.setAttribute("values", "0.3;1;0.3");
      animO.setAttribute("dur", `${DURATION}s`);
      animO.setAttribute("begin", `${frac * DURATION}s`);
      animO.setAttribute("repeatCount", "indefinite");
      animO.setAttribute("calcMode", "spline");
      animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      c.appendChild(animO);
    }
  }

  function renderFrame(ctx, size, time) {
    const { n, dotRadius, margin } = getParams(size);
    const center = SIZE / 2;
    const maxRadius = center - margin - dotRadius;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);

    const scale = size / SIZE;
    ctx.fillStyle = DOT_COLOR;

    for (let i = 0; i < n; i++) {
      const idx = i + 0.5;
      const frac = idx / n;
      const offset = frac * DURATION;
      const localT = ((time - offset) % DURATION + DURATION) % DURATION;
      const pulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * localT) / DURATION);
      const r = dotRadius * (0.5 + pulse);
      const opacity = 0.3 + 0.7 * pulse;

      const dist = Math.sqrt(frac) * maxRadius;
      const theta = idx * GOLDEN_ANGLE;
      const x = center + dist * Math.cos(theta);
      const y = center + dist * Math.sin(theta);

      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(x * scale, y * scale, r * scale, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function exportSVG() {
    const container = document.getElementById("spiral");
    const svg = container.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true);
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `circle { fill: ${DOT_COLOR}; opacity: 0.6; }`;
    clone.insertBefore(style, clone.firstChild);
    const xml = new XMLSerializer().serializeToString(clone);
    const decl = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const blob = new Blob([decl + xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "golden-spiral.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportGIF() {
    const container = document.getElementById("spiral");
    const currentSize = container.clientWidth || 400;
    const fps = 15;
    const frameCount = Math.ceil(DURATION * fps);
    const delay = 1000 / fps;

    const canvas = document.createElement("canvas");
    canvas.width = currentSize;
    canvas.height = currentSize;
    const ctx = canvas.getContext("2d");

    const workerBlob = await fetch(
      "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js"
    ).then((r) => r.blob());

    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: URL.createObjectURL(workerBlob),
    });

    for (let i = 0; i < frameCount; i++) {
      const t = (i / frameCount) * DURATION;
      renderFrame(ctx, currentSize, t);
      gif.addFrame(ctx, { copy: true, delay });
    }

    return new Promise((resolve) => {
      gif.on("finished", (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "golden-spiral.gif";
        a.click();
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(gif.workerScript);
        resolve();
      });
      gif.render();
    });
  }

  const container = document.getElementById("spiral");
  let currentSize = 400;

  function setSize(size) {
    currentSize = size;
    container.style.width = size + "px";
    container.style.height = size + "px";
    buildSpiral(container, size);
    document
      .querySelectorAll(".size-btn")
      .forEach((btn) =>
        btn.classList.toggle("active", parseInt(btn.dataset.size) === size)
      );
  }

  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setSize(parseInt(btn.dataset.size));
    });
  });

  document.getElementById("export-svg").addEventListener("click", exportSVG);

  const gifBtn = document.getElementById("export-gif");
  gifBtn.addEventListener("click", async () => {
    gifBtn.disabled = true;
    gifBtn.textContent = "Encoding...";
    try {
      await exportGIF();
    } finally {
      gifBtn.disabled = false;
      gifBtn.textContent = "Export GIF";
    }
  });

  setSize(400);
})();
