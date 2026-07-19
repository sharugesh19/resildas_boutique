// scripts/compressExistingImages.js
//
// One-time migration: recompresses every product image already sitting in
// Firebase Storage (uploaded before ImageUploader.jsx's compression fix
// went live), then updates the product's Firestore doc to point at the new,
// smaller file. Old files are left in Storage (not deleted) so this is safe
// to run — nothing is destroyed, worst case you have some unused old files
// taking a little extra Storage space, which costs very little.
//
// Idempotent: adds `imagesOptimized: true` to each product doc after
// processing, and skips any product that already has that flag — so it's
// safe to re-run if it gets interrupted partway through.
//
// USAGE:
//   node scripts/compressExistingImages.js
//   node scripts/compressExistingImages.js --dry-run   (preview only, no changes)
//
// Requirements:
//   1. npm install firebase-admin sharp node-fetch@2
//      (node-fetch@2 specifically — v3 is ESM-only and this script is CJS)
//   2. scripts/serviceAccountKey.json must exist

const path = require('path');
const sharp = require('sharp');
const fetch = require('node-fetch');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const db = getFirestore();
const bucket = getStorage().bucket();

const DRY_RUN = process.argv.includes('--dry-run');
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const TARGET_MAX_BYTES = 400 * 1024; // ~400KB, matches ImageUploader.jsx's target

// Skip files that are already .webp AND already under the target size —
// covers images that went through the new compressed uploader already,
// even on a product that hasn't been marked imagesOptimized yet.
async function isAlreadySmallWebp(url) {
  if (!url.includes('.webp')) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const size = Number(res.headers.get('content-length') || 0);
    return size > 0 && size <= TARGET_MAX_BYTES;
  } catch {
    return false;
  }
}

// Downloads a URL as a buffer, retrying up to `retries` times if the
// connection drops (ECONNRESET etc. happen occasionally on large files —
// this is a network flake, not a bug, so we just try again).
async function downloadWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.buffer();
    } catch (err) {
      const isLastAttempt = attempt === retries;
      console.warn(`    ⚠ download attempt ${attempt}/${retries} failed (${err.message})${isLastAttempt ? '' : ', retrying...'}`);
      if (isLastAttempt) {
        return null;
      }
      // brief pause before retrying so we don't hammer the server
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
}

async function compressAndReupload(url, productId) {
  if (await isAlreadySmallWebp(url)) {
    console.log(`    ↳ already small webp, skipping: ${url.slice(0, 80)}...`);
    return url;
  }

  const inputBuffer = await downloadWithRetry(url);
  if (!inputBuffer) {
    console.warn(`    ⚠ giving up after retries, leaving as-is: ${url}`);
    return url;
  }
  const originalSizeKB = (inputBuffer.length / 1024).toFixed(0);

  let outputBuffer;
  try {
    outputBuffer = await sharp(inputBuffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch (err) {
    console.warn(`    ⚠ compression failed (${err.message}), leaving as-is: ${url}`);
    return url;
  }
  const newSizeKB = (outputBuffer.length / 1024).toFixed(0);

  if (DRY_RUN) {
    console.log(`    ↳ [dry-run] would compress ${originalSizeKB}KB → ~${newSizeKB}KB`);
    return url;
  }

  const destPath = `products/${productId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`;
  const file = bucket.file(destPath);
  await file.save(outputBuffer, {
    metadata: { contentType: 'image/webp' },
  });
  await file.makePublic();
  const newUrl = `https://storage.googleapis.com/${bucket.name}/${destPath}`;

  console.log(`    ↳ compressed ${originalSizeKB}KB → ${newSizeKB}KB`);
  return newUrl;
}

async function processImageArray(images, productId) {
  if (!Array.isArray(images) || images.length === 0) return images;
  const results = [];
  for (const url of images) {
    if (typeof url !== 'string' || !url.startsWith('http')) {
      results.push(url);
      continue;
    }
    const newUrl = await compressAndReupload(url, productId);
    results.push(newUrl);
  }
  return results;
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no changes will be made\n' : '🚀 Starting image compression migration\n');

  const snap = await db.collection('products').get();
  console.log(`Found ${snap.size} products.\n`);

  let processed = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();

    if (data.imagesOptimized === true) {
      skipped++;
      continue;
    }

    console.log(`📦 ${doc.id} — ${data.name || '(no name)'}`);

    const updates = {};

    if (Array.isArray(data.images)) {
      updates.images = await processImageArray(data.images, doc.id);
    }

    if (Array.isArray(data.colors) && data.colors.length > 0) {
      const newColors = [];
      for (const color of data.colors) {
        const newColor = { ...color };
        if (Array.isArray(color.images)) {
          newColor.images = await processImageArray(color.images, `${doc.id}_${color.name || 'color'}`);
        }
        newColors.push(newColor);
      }
      updates.colors = newColors;
    }

    if (!DRY_RUN) {
      updates.imagesOptimized = true;
      updates.imagesOptimizedAt = FieldValue.serverTimestamp();
      await doc.ref.update(updates);
    }

    processed++;
    console.log('');
  }

  console.log(`\n✅ Done. Processed: ${processed}, Already optimized (skipped): ${skipped}`);
  if (DRY_RUN) {
    console.log('This was a dry run — nothing was actually changed. Re-run without --dry-run to apply.');
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});