const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "..", "public", "assets", "lanyard");
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");

function rgba(r, g, b, a = 255) {
  return ((r & 0xff) << 24) | ((g & 0xff) << 16) | ((b & 0xff) << 8) | (a & 0xff);
}

function hexToInt(hex) {
  return rgba(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255);
}

function lerpColor(c1, c2, t) {
  const r1 = (c1 >> 24) & 0xff, g1 = (c1 >> 16) & 0xff, b1 = (c1 >> 8) & 0xff;
  const r2 = (c2 >> 24) & 0xff, g2 = (c2 >> 16) & 0xff, b2 = (c2 >> 8) & 0xff;
  return rgba(
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
    255
  );
}

// ==============================
// STRAP TEXTURE - Blue with "WEB DEVELOPER </>"
// ==============================
async function generateStrapTexture() {
  const width = 1024;
  const height = 256;

  console.log("Creating strap image...");
  const img = new Jimp({ width, height });

  const black = rgba(0, 0, 0, 255);
  const white = rgba(255, 255, 255, 255);
  const textBandCenter = height / 2;

  // Process all pixels
  img.scan(0, 0, width, height, function (x, y, idx) {
    let finalColor = black;

    // Draw text pattern - "RiskiWs"
    const blockWidth = 200;
    const relX = x % blockWidth;

    // R
    if (relX >= 10 && relX < 24) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }
    // i
    if (relX >= 28 && relX < 36) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }
    // s
    if (relX >= 40 && relX < 52) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }
    // k
    if (relX >= 56 && relX < 68) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }
    // i
    if (relX >= 72 && relX < 80) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }
    // W
    if (relX >= 84 && relX < 100) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }
    // s
    if (relX >= 104 && relX < 116) {
      const dy = y - textBandCenter;
      if (Math.abs(dy) < 35) finalColor = white;
    }

    // Separator dot
    if (relX >= blockWidth - 14 && relX <= blockWidth - 6) {
      const dx = relX - (blockWidth - 10);
      const dy = y - textBandCenter;
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) finalColor = white;
    }

    // Set final pixel
    this.bitmap.data[idx + 0] = (finalColor >> 24) & 0xff;
    this.bitmap.data[idx + 1] = (finalColor >> 16) & 0xff;
    this.bitmap.data[idx + 2] = (finalColor >> 8) & 0xff;
    this.bitmap.data[idx + 3] = finalColor & 0xff;
  });

  const outPath = path.join(ASSETS_DIR, "lanyard.png");
  await img.write(outPath);
  console.log(`Generated strap: ${outPath} (${width}x${height})`);
}

// ==============================
// CARD FRONT TEXTURE - Formal photo with dark theme styling
// ==============================
async function generateCardTexture() {
  const formalPath = path.join(IMAGES_DIR, "formal.png");

  if (!fs.existsSync(formalPath)) {
    console.log("formal.png not found, skipping card texture processing");
    return;
  }

  console.log("Processing formal photo...");
  const img = await Jimp.read(formalPath);
  const imgW = img.bitmap.width;
  const imgH = img.bitmap.height;

  const cardW = 1080;
  const cardH = Math.round(cardW * (imgH / imgW));

  // Resize photo to cover canvas
  const scale = Math.max(cardW / imgW, cardH / imgH);
  const scaledW = Math.round(imgW * scale);
  const scaledH = Math.round(imgH * scale);
  img.resize({ w: scaledW, h: scaledH });

  // Crop to center
  const offsetX = Math.round((scaledW - cardW) / 2);
  const offsetY = Math.round((scaledH - cardH) / 2);
  img.crop({ x: offsetX, y: offsetY, w: cardW, h: cardH });

  // Create card canvas and composite photo
  const card = new Jimp({ width: cardW, height: cardH });
  card.composite(img, 0, 0);

  // Apply dark gradient overlay + vignette + bottom bar
  const borderColor = rgba(255, 255, 255, 20);
  const barY = cardH - 100;

  card.scan(0, 0, cardW, cardH, function (x, y, idx) {
    // Current pixel
    let r = this.bitmap.data[idx + 0];
    let g = this.bitmap.data[idx + 1];
    let b = this.bitmap.data[idx + 2];

    // Gradient overlay (dark at bottom)
    const t = y / cardH;
    let overlay = 0;
    if (t > 0.5) {
      overlay = (t - 0.5) * 2 * 0.85;
    } else if (t > 0.2) {
      overlay = ((t - 0.2) / 0.3) * 0.5;
    }
    overlay = Math.min(0.85, Math.max(0.05, overlay));

    // Vignette
    const dxNorm = Math.abs(x - cardW / 2) / (cardW / 2);
    const vignette = Math.pow(dxNorm, 2) * 0.3;
    const total = Math.min(0.9, overlay + vignette);

    r = Math.round(r * (1 - total) + 5 * total);
    g = Math.round(g * (1 - total) + 5 * total);
    b = Math.round(b * (1 - total) + 5 * total);

    // Bottom bar
    if (y >= barY) {
      r = Math.round(r * 0.3 + 5 * 0.7);
      g = Math.round(g * 0.3 + 5 * 0.7);
      b = Math.round(b * 0.3 + 5 * 0.7);
    }

    // Border pixels
    if (x === 4 || x === cardW - 5 || y === 4 || y === cardH - 5) {
      r = Math.min(255, r + 20);
      g = Math.min(255, g + 20);
      b = Math.min(255, b + 20);
    }

    // Blue accent line on bar
    if (y === barY || y === barY + 1) {
      if (x >= 40 && x < 100) {
        r = Math.round(r * 0.6 + 59 * 0.4);
        g = Math.round(g * 0.6 + 130 * 0.4);
        b = Math.round(b * 0.6 + 246 * 0.4);
      }
    }

    // Noise/grain
    if (Math.random() < 0.008) {
      const n = Math.random() < 0.5 ? 5 : -5;
      r = Math.max(0, Math.min(255, r + n));
      g = Math.max(0, Math.min(255, g + n));
      b = Math.max(0, Math.min(255, b + n));
    }

    this.bitmap.data[idx + 0] = r;
    this.bitmap.data[idx + 1] = g;
    this.bitmap.data[idx + 2] = b;
    this.bitmap.data[idx + 3] = 255;
  });

  const outPath = path.join(IMAGES_DIR, "lanyard-card-front.png");
  await card.write(outPath);
  console.log(`Generated card front: ${outPath} (${cardW}x${cardH})`);
}

// ==============================
// RUN
// ==============================
async function main() {
  console.log("=== Generating Lanyard Assets ===\n");
  await generateStrapTexture();
  await generateCardTexture();
  console.log("\n=== Done! ===");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
