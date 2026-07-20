// scripts/compressStaticAssets.js
//
// One-time compression pass for static site assets in public/assets
// (hero banners, loader, logo, category thumbnails) — separate from
// compressExistingImages.js, which only handles Firestore product images.
//
// Converts every PNG/JPG in public/assets (and public/assets/category)
// to WebP, saving alongside the original with the same filename but a
// .webp extension. Originals are NOT deleted — this only adds new files.
// You update your code afterward to reference the new .webp filenames.
//
// USAGE:
//   node scripts/compressStaticAssets.js
//   node scripts/compressStaticAssets.js --dry-run

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DRY_RUN = process.argv.includes('--dry-run');
const TARGETS = [
  path.join(__dirname, '..', 'public', 'assets'),
  path.join(__dirname, '..', 'public', 'assets', 'category'),
];
const WEBP_QUALITY = 80;
const MAX_WIDTH = 1920; // hero banners can stay a bit larger than product photos

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const originalSizeKB = (fs.statSync(filePath).size / 1024).toFixed(0);
  const outputPath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');

  if (fs.existsSync(outputPath)) {
    console.log(`  ↳ skip (already has .webp): ${path.basename(filePath)}`);
    return;
  }

  if (DRY_RUN) {
    console.log(`  ↳ [dry-run] would convert ${path.basename(filePath)} (${originalSizeKB}KB) → .webp`);
    return;
  }

  const outputBuffer = await sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  fs.writeFileSync(outputPath, outputBuffer);
  const newSizeKB = (outputBuffer.length / 1024).toFixed(0);
  console.log(`  ↳ ${path.basename(filePath)}: ${originalSizeKB}KB → ${newSizeKB}KB (saved as ${path.basename(outputPath)})`);
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no files will be written\n' : '🚀 Compressing static assets\n');

  for (const dir of TARGETS) {
    if (!fs.existsSync(dir)) continue;
    console.log(`📁 ${dir}`);
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) {
        await compressFile(fullPath);
      }
    }
    console.log('');
  }

  console.log('✅ Done.');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});