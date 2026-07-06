/**
 * scripts/migrateColorSizes.js
 *
 * ONE-TIME MIGRATION: Converts old schema
 *   { sizes: ['L (36")', 'XL (38")'], colors: [{ name, colorCode, images, inStock }] }
 * into the new per-color-per-size schema
 *   { colors: [{ name, colorCode, images, sizes: [{ size, stock }] }] }
 *
 * Placeholder stock numbers are assigned in a rotating pattern (3, 4, 5, 6...)
 * per size so they're NOT all identical — go into the Admin panel afterwards
 * and correct each one to the real stock count.
 *
 * Safe to run multiple times: if a color already has the new `sizes: [{size,stock}]`
 * format (detected by checking if the first size entry is an object), it is SKIPPED
 * so re-running won't overwrite numbers you've already corrected in the admin panel.
 *
 * Usage:
 *   node scripts/migrateColorSizes.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Product IDs that currently use the OLD schema (flat sizes + colors w/o per-size stock)
const PRODUCT_IDS_TO_MIGRATE = [
  'SAL001',
  'SAL006',
  'SAL007',
  'ORG001',
  'KUR007',
  'KUR008',
  'KUR009',
  'KUR010',
];

// Rotating placeholder stock values — cycles 3,4,5,6,3,4,5,6...
const PLACEHOLDER_STOCK_CYCLE = [3, 4, 5, 6];

function isAlreadyMigrated(color) {
  // New format: color.sizes is an array of objects { size, stock }
  return (
    Array.isArray(color.sizes) &&
    color.sizes.length > 0 &&
    typeof color.sizes[0] === 'object' &&
    color.sizes[0] !== null &&
    'size' in color.sizes[0]
  );
}

async function migrateProduct(productId) {
  const ref = db.collection('products').doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    console.log(`⚠ Skipped ${productId} — document not found`);
    return;
  }

  const data = snap.data();

  if (!Array.isArray(data.colors) || data.colors.length === 0) {
    console.log(`⚠ Skipped ${productId} — no colors array found`);
    return;
  }

  // Fallback: old shared sizes list at product level, used only for colors
  // that don't already have their own sizes for some reason.
  const sharedSizes = Array.isArray(data.sizes) ? data.sizes : [];

  let cycleIndex = 0;
  let anyChanged = false;

  const updatedColors = data.colors.map((color) => {
    if (isAlreadyMigrated(color)) {
      console.log(`  ↳ ${productId} / ${color.name}: already migrated, left untouched`);
      return color;
    }

    const sizeList = Array.isArray(color.sizes) ? color.sizes : sharedSizes;

    const newSizes = sizeList.map((sizeLabel) => {
      const stock = PLACEHOLDER_STOCK_CYCLE[cycleIndex % PLACEHOLDER_STOCK_CYCLE.length];
      cycleIndex += 1;
      return { size: sizeLabel, stock };
    });

    anyChanged = true;

    return {
      ...color,
      sizes: newSizes,
    };
  });

  if (!anyChanged) {
    console.log(`✓ ${productId} — nothing to migrate, all colors already in new format`);
    return;
  }

  await ref.update({ colors: updatedColors });
  console.log(`✓ Migrated ${productId} (${updatedColors.length} colors updated)`);
}

async function run() {
  console.log(`Starting migration for ${PRODUCT_IDS_TO_MIGRATE.length} products...\n`);

  for (const id of PRODUCT_IDS_TO_MIGRATE) {
    try {
      await migrateProduct(id);
    } catch (err) {
      console.error(`✗ Failed to migrate ${id}:`, err.message);
    }
  }

  console.log('\nDone. Go into the Admin panel and correct each placeholder stock number to the real count.');
  process.exit(0);
}

run();