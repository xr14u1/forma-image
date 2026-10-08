const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const publicDir = path.join(__dirname, '..', 'public');
  const svgPath = path.join(publicDir, 'favicon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Rendering high-res icons from SVG...');

  // Standard sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 }, // Crucial for Google Search Favicon crawler
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
  ];

  for (const s of sizes) {
    await sharp(svgBuffer)
      .resize(s.size, s.size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(publicDir, s.name));
    console.log(`✓ Generated ${s.name} (${s.size}x${s.size})`);
  }

  // Also create favicon.ico from 48x48 png
  const png48Buffer = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png48Buffer);
  console.log('✓ Generated favicon.ico');

  // Generate 1200x630 OG Image banner for OpenGraph / Google preview
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="ogBg" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#141916" />
        <stop offset="60%" stop-color="#070908" />
        <stop offset="100%" stop-color="#000000" />
      </radialGradient>
      <linearGradient id="ogEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00FFA3" />
        <stop offset="50%" stop-color="#00E599" />
        <stop offset="100%" stop-color="#05DF72" />
      </linearGradient>
      <filter id="ogGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="#00E599" flood-opacity="0.45" />
      </filter>
    </defs>
    <rect width="1200" height="630" fill="url(#ogBg)" />
    
    <!-- Ambient Grid -->
    <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
      <line x1="0" y1="150" x2="1200" y2="150" />
      <line x1="0" y1="300" x2="1200" y2="300" />
      <line x1="0" y1="450" x2="1200" y2="450" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Center Icon Squircle -->
    <rect x="520" y="100" width="160" height="160" rx="38" fill="#0D120F" stroke="#222B26" stroke-width="3" filter="url(#ogGlow)" />
    
    <!-- F Emblem in center -->
    <path d="M 564 140 C 564 135 568 131 573 131 L 634 131 C 638 131 641 135 640 139 L 635 155 C 634 158 631 160 628 160 L 592 160 C 589 160 586 163 586 166 L 586 167 C 586 170 589 173 592 173 L 620 173 C 624 173 627 177 626 181 L 621 197 C 620 200 617 202 614 202 L 592 202 C 589 202 586 205 586 208 L 586 220 C 586 225 582 229 577 229 L 567 229 C 564 229 562 227 562 224 Z" fill="url(#ogEmerald)" />
    
    <!-- Title -->
    <text x="600" y="340" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="54" font-weight="800" letter-spacing="-1.5">FORMA IMAGE STUDIO</text>
    
    <!-- Subtitle -->
    <text x="600" y="400" text-anchor="middle" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="500">100% Private Browser Image Converter &amp; Toolkit</text>
    
    <!-- Formats badge -->
    <text x="600" y="460" text-anchor="middle" fill="#00FFA3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" letter-spacing="2">PNG • JPG • WEBP • AVIF • SVG • TIFF • HEIC • ICO • BMP</text>
    
    <!-- Creator Attribution -->
    <text x="600" y="550" text-anchor="middle" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600">Created by snuffdied • snuffdied.vercel.app</text>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ Generated og-image.png (1200x630)');

  // Generate webmanifest
  const manifest = {
    name: "Forma Image Studio",
    short_name: "Forma",
    description: "100% Private Browser Image Converter & Studio by snuffdied",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('✓ Generated site.webmanifest');
  console.log('All icons generated successfully!');
}

generate().catch(console.error);
