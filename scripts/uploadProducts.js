/**
 * Resilda's Boutique — Bulk Product Upload Script
 * ─────────────────────────────────────────────────
 * Run from: resildas_boutique_frontend_react/scripts/
 * Command:  node uploadProducts.js
 *
 * What it does:
 *  1. Reads images from your Desktop/product-images folder
 *  2. Uploads each image to Firebase Storage
 *  3. Creates product documents in Firestore with all details + image URLs
 *  4. Skips any product that already exists (safe to re-run)
 */

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')
const fs    = require('fs')
const path  = require('path')

// ── Init ────────────────────────────────────────────────────────────────────
const serviceAccount = require('./serviceAccountKey.json')
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'resildas-fa23f.firebasestorage.app',
})
const db     = getFirestore()
const bucket = getStorage().bucket()

// ── Base path to your product-images folder ─────────────────────────────────
const BASE_PATH = 'C:\\Users\\kmahe\\OneDrive\\Desktop\\product-images'

// ── Folder names (exact, as on disk) ────────────────────────────────────────
const FOLDERS = {
  salwar:  'Unstitched salwar set',
  kurthi:  'Kurthi set',
  organza: 'Organza saree',
  cotton:  'Cotton saree',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function findFile(folderKey, baseName) {
  const folder = FOLDERS[folderKey]
  for (const ext of ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.webp']) {
    const full = path.join(BASE_PATH, folder, baseName + ext)
    if (fs.existsSync(full)) return full
  }
  console.warn(`  ⚠ File not found: ${folder}/${baseName}.*`)
  return null
}

async function uploadImage(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { contentType: 'image/jpeg' },
  })
  const encoded = storagePath.split('/').map(encodeURIComponent).join('%2F')
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media`
}

async function uploadImages(folderKey, fileNames, storagePrefix) {
  const urls = []
  for (const name of fileNames) {
    const local = findFile(folderKey, name)
    if (!local) continue
    const storagePath = `products/${storagePrefix}/${name}.jpg`
    console.log(`    ↑ Uploading ${name}...`)
    const url = await uploadImage(local, storagePath)
    urls.push(url)
  }
  return urls
}

// ── Product Manifest ─────────────────────────────────────────────────────────
// Each entry = one Firestore document.
// Single-color products: { imageFiles: [...] }
// Multi-color products:  { colors: [{ name, colorCode, imageFiles: [...] }] }
// ────────────────────────────────────────────────────────────────────────────

const PRODUCTS = [

  // ════════════════════════════════════════════════════════
  // UNSTITCHED SALWAR SET
  // ════════════════════════════════════════════════════════

  {
    id: 'SAL001',
    name: 'Linen Cotton Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1099,
    description: 'Linen cotton unstitched salwar material with embroidered Kota dupatta. Lightweight and elegant for regular wear.',
    topFabric: 'Linen Cotton',
    bottomFabric: 'Mixed Cotton',
    dupatta: 'Embroidered Kota Fabric',
    fabricLength: 'Top: 2.3m | Bottom: 2.3m | Dupatta: 2.25m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Regular Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: true,
    folderKey: 'salwar',
    colors: [
      { name: 'Olive Green', colorCode: '#708238', imageFiles: ['linen-cotton-unstitched-salwar-material-olive-green-1'] },
      { name: 'Red',         colorCode: '#CC0000', imageFiles: ['linen-cotton-unstitched-salwar-material-red-1'] },
      { name: 'Orange',      colorCode: '#FF8C00', imageFiles: ['linen-cotton-unstitched-salwar-material-orange-1'] },
    ],
  },

  {
    id: 'SAL002',
    name: 'Semi Cotton Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1650,
    description: 'Semi cotton unstitched salwar material with organza dupatta. Perfect for regular and party wear.',
    topFabric: 'Mixed Cotton',
    bottomFabric: 'Cotton',
    dupatta: 'Organza',
    fabricLength: 'Top: 2.75m | Bottom: 2.5m | Dupatta: 2.5m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Regular Wear', 'Party Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'salwar',
    imageFiles: ['semi-cotton-unstitched-salwar-material-1'],
  },

  {
    id: 'SAL003',
    name: 'Embroidered Cotton Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1550,
    description: 'Fully embroidered cotton top with chiffon dupatta. Elegant choice for regular and party wear.',
    topFabric: 'Cotton (Fully Embroidered)',
    bottomFabric: 'Cotton',
    dupatta: 'Chiffon',
    fabricLength: 'Top: 2.5m | Bottom: 2.5m | Dupatta: 2.5m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Regular Wear', 'Party Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: true, isNewArrival: false,
    folderKey: 'salwar',
    imageFiles: ['embroidered-cotton-unstitched-salwar-material-1'],
  },

  {
    id: 'SAL004',
    name: 'Linen Cotton Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1400,
    description: 'Linen cotton unstitched salwar material with chiffon dupatta. Comfortable and stylish for everyday wear.',
    topFabric: 'Linen Cotton',
    bottomFabric: 'Cotton',
    dupatta: 'Chiffon',
    fabricLength: 'Top: 2.5m | Bottom: 2.5m | Dupatta: 2.5m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Regular Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'salwar',
    imageFiles: ['linen-cotton-unstitched-salwar-material-1'],
  },

  {
    id: 'SAL005',
    name: 'Mixed Cotton Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1699,
    description: 'Mixed cotton unstitched salwar material with chiffon dupatta. Versatile choice for regular wear.',
    topFabric: 'Mixed Cotton',
    bottomFabric: 'Cotton',
    dupatta: 'Chiffon',
    fabricLength: 'Top: 2.5m | Bottom: 2.5m | Dupatta: 2.5m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Regular Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'salwar',
    imageFiles: ['mixed-cotton-unstitched-salwar-material-1'],
  },

  {
    id: 'SAL006',
    name: 'Mixed Cotton Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1550,
    description: 'Mixed cotton unstitched salwar material in vibrant party wear colors. All-mixed cotton set including dupatta.',
    topFabric: 'Mixed Cotton',
    bottomFabric: 'Mixed Cotton',
    dupatta: 'Mixed Cotton',
    fabricLength: 'Top: 2.5m | Bottom: 2.5m | Dupatta: 2.3m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Party Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: true,
    folderKey: 'salwar',
    colors: [
      { name: 'Crimson Pink', colorCode: '#DC143C', imageFiles: ['mixed-cotton-unstitched-salwar-material-crimson-pink-1'] },
      { name: 'Deep Maroon',  colorCode: '#800000', imageFiles: ['mixed-cotton-unstitched-salwar-material-deep-maroon-1'] },
      { name: 'Leaf Green',   colorCode: '#228B22', imageFiles: ['mixed-cotton-unstitched-salwar-material-leaf-green-1'] },
      { name: 'Magenta',      colorCode: '#FF00FF', imageFiles: ['mixed-cotton-unstitched-salwar-material-magenta-1'] },
      { name: 'Royal Blue',   colorCode: '#4169E1', imageFiles: ['mixed-cotton-unstitched-salwar-material-royal-blue-1'] },
    ],
  },

  {
    id: 'SAL007',
    name: 'Tissue Organza Unstitched Salwar Material',
    category: 'unstitched-salwar',
    price: 1550,
    description: 'Tissue organza unstitched salwar material with sequinned neck portion. Stunning party wear in soft pastel shades.',
    topFabric: 'Tissue Organza (Sequinned Neck)',
    bottomFabric: 'Mixed Cotton',
    dupatta: 'Tissue Organza',
    fabricLength: 'Top: 2.5m | Bottom: 2.5m | Dupatta: 2.7m',
    setIncludes: 'Top + Bottom + Dupatta',
    occasion: ['Party Wear'],
    washCare: 'Bucket wash, mild detergent',
    sizes: ['Free Size'],
    inStock: true, isFeatured: true, isNewArrival: true,
    folderKey: 'salwar',
    colors: [
      { name: 'Aqua Green', colorCode: '#00CED1', imageFiles: ['tissue-organza-unstitched-salwar-material-aqua-green-1'] },
      { name: 'Baby Pink',  colorCode: '#FFB6C1', imageFiles: ['tissue-organza-unstitched-salwar-material-baby-pink-1'] },
      { name: 'Olive Green',colorCode: '#708238', imageFiles: ['tissue-organza-unstitched-salwar-material-olive-green-1'] },
      { name: 'Peach Pink', colorCode: '#FFDAB9', imageFiles: ['tissue-organza-unstitched-salwar-material-peach-pink-1'] },
      { name: 'Sky Blue',   colorCode: '#87CEEB', imageFiles: ['tissue-organza-unstitched-salwar-material-sky-blue-1'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // ORGANZA SAREE
  // ════════════════════════════════════════════════════════

  {
    id: 'ORG001',
    name: 'Tissue Organza Saree',
    category: 'organza-saree',
    price: 1450,
    description: 'Tissue organza saree with zari border and blouse piece. Perfect for parties and special occasions.',
    fabric: 'Tissue Organza',
    blouseIncluded: true,
    sareeLength: '5.5m',
    blouseLength: '1m',
    borderType: 'Zari Border',
    occasion: ['Party Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: true, isNewArrival: false,
    folderKey: 'organza',
    colors: [
      { name: 'Forest Green',  colorCode: '#228B22', imageFiles: ['tissue-organza-saree-forest-green-1'] },
      { name: 'Golden Yellow', colorCode: '#FFD700', imageFiles: ['tissue-organza-saree-golden-yellow-1'] },
      { name: 'Ocean Blue',    colorCode: '#006994', imageFiles: ['tissue-organza-saree-ocean-blue-1'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // KURTHI SET
  // ════════════════════════════════════════════════════════

  {
    id: 'KUR001',
    name: 'Casual Wear Kurti',
    category: 'kurthi-set',
    price: 699,
    description: 'Mixed cotton casual wear kurti with floral print. Side open slit pattern with 3/4th sleeve.',
    fabric: 'Mixed Cotton',
    neckType: 'Closed Collar',
    sleeveType: '3/4th Sleeve',
    length: '42 inches',
    pattern: 'Side Open Slit',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['S', 'M', 'XL'],
    inStock: true, isFeatured: false, isNewArrival: true,
    folderKey: 'kurthi',
    imageFiles: ['casual-kurthi-set-floral-print-1'],
  },

  {
    id: 'KUR002',
    name: 'Casual Wear Kurti',
    category: 'kurthi-set',
    price: 799,
    description: 'Raw silk casual wear kurti with dobby striped pattern. V-neck with 3/4th sleeve and side open slit.',
    fabric: 'Raw Silk',
    neckType: 'V Neck',
    sleeveType: '3/4th Sleeve',
    length: '43 inches',
    pattern: 'Side Open Slit',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['S', 'M', 'XL'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['casual-kurthi-set-dobby-striped-1'],
  },

  {
    id: 'KUR003',
    name: 'Casual Wear Kurti',
    category: 'kurthi-set',
    price: 950,
    description: 'Raw silk casual wear kurti with checkered print. U-neck with 3/4th sleeve and side open slit.',
    fabric: 'Raw Silk',
    neckType: 'U Neck',
    sleeveType: '3/4th Sleeve',
    length: '42 inches',
    pattern: 'Side Open Slit',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['S', 'L'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['casual-kurthi-set-checkered-print-1'],
  },

  {
    id: 'KUR004',
    name: 'Casual Wear Kurti',
    category: 'kurthi-set',
    price: 899,
    description: 'Mixed cotton casual wear kurti with ethnic patchwork print. Umbrella pattern with U-neck and 3/4th sleeve.',
    fabric: 'Mixed Cotton',
    neckType: 'U Neck',
    sleeveType: '3/4th Sleeve',
    length: '47 inches',
    pattern: 'Umbrella',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['S', 'M', 'XL', 'XXL'],
    inStock: true, isFeatured: true, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['casual-kurthi-set-ethnic-patchwork-print-1'],
  },

  {
    id: 'KUR005',
    name: 'Casual Wear Kurti',
    category: 'kurthi-set',
    price: 850,
    description: 'Raw silk casual wear kurti with minimal dobby pattern. U-neck with 3/4th sleeve and side open top.',
    fabric: 'Raw Silk',
    neckType: 'U Neck',
    sleeveType: '3/4th Sleeve',
    length: '43 inches',
    pattern: 'Side Open Top',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['M'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['casual-kurthi-set-minimal-dobby-1'],
  },

  {
    id: 'KUR006',
    name: 'Off White Kurti',
    category: 'kurthi-set',
    price: 899,
    description: 'Elegant off white chanderi cotton kurti with ethnic design. U-neck with 3/4th sleeve and side open top. Perfect for regular and occasional wear.',
    fabric: 'Chanderi Cotton',
    neckType: 'U Neck',
    sleeveType: '3/4th Sleeve',
    length: '43 inches',
    pattern: 'Side Open Top',
    occasion: ['Regular Wear', 'Occasional Wear'],
    washCare: 'Normal wash',
    sizes: ['L'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['off-white-casual-kurthi-set-ethnic-1'],
  },

  {
    id: 'KUR007',
    name: 'Short Kurti',
    category: 'kurthi-set',
    price: 650,
    description: 'Rayon short kurti with ikat butti print. Closed collar with 3/4th sleeve. Available in multiple colors.',
    fabric: 'Rayon',
    neckType: 'Closed Collar Neck',
    sleeveType: '3/4th Sleeve',
    length: '30 inches',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['L (36")', 'XL (38")'],
    inStock: true, isFeatured: false, isNewArrival: true,
    folderKey: 'kurthi',
    colors: [
      { name: 'Navy Blue', colorCode: '#000080', imageFiles: ['short-kurti-ikat-butti-print-navy-blue-1'] },
      { name: 'Rose Pink', colorCode: '#FF007F', imageFiles: ['short-kurti-ikat-butti-print-rose-pink-1'] },
      { name: 'Sage Green',colorCode: '#8FBC8F', imageFiles: ['short-kurti-ikat-butti-print-sage-green-1'] },
    ],
  },

  {
    id: 'KUR008',
    name: 'Short Kurti',
    category: 'kurthi-set',
    price: 650,
    description: 'Rayon short kurti with fine pinstripes pattern. Closed collar with 3/4th sleeve. Available in 7 colors.',
    fabric: 'Rayon',
    neckType: 'Closed Collar Neck',
    sleeveType: '3/4th Sleeve',
    length: '30 inches',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['L (36")', 'XL (38")'],
    inStock: true, isFeatured: true, isNewArrival: false,
    folderKey: 'kurthi',
    colors: [
      { name: 'Black',       colorCode: '#1a1a1a', imageFiles: ['short-kurti-pinstripes-black-1'] },
      { name: 'Black White', colorCode: '#555555', imageFiles: ['short-kurti-pinstripes-black-white-1'] },
      { name: 'Coral Pink',  colorCode: '#FF6B6B', imageFiles: ['short-kurti-pinstripes-coral-pink-1'] },
      { name: 'Light Pink',  colorCode: '#FFB6C1', imageFiles: ['short-kurti-pinstripes-light-pink-1'] },
      { name: 'Navy Blue',   colorCode: '#000080', imageFiles: ['short-kurti-pinstripes-navy-blue-1'] },
      { name: 'Red',         colorCode: '#CC0000', imageFiles: ['short-kurti-pinstripes-red-1'] },
      { name: 'Sage Green',  colorCode: '#8FBC8F', imageFiles: ['short-kurti-pinstripes-sage-green-1'] },
    ],
  },

  {
    id: 'KUR009',
    name: 'Short Kurti',
    category: 'kurthi-set',
    price: 650,
    description: 'Rayon short kurti with vertical stripes pattern. Closed collar with 3/4th sleeve. Available in 5 rich colors.',
    fabric: 'Rayon',
    neckType: 'Closed Collar Neck',
    sleeveType: '3/4th Sleeve',
    length: '30 inches',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['L (36")', 'XL (38")'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    colors: [
      { name: 'Black Red',     colorCode: '#8B0000', imageFiles: ['short-kurti-vertical-stripes-black-red-1'] },
      { name: 'Charcoal Grey', colorCode: '#36454F', imageFiles: ['short-kurti-vertical-stripes-charcoal-grey-1'] },
      { name: 'Dark Green',    colorCode: '#006400', imageFiles: ['short-kurti-vertical-stripes-dark-green-1'] },
      { name: 'Maroon',        colorCode: '#800000', imageFiles: ['short-kurti-vertical-stripes-maroon-1'] },
      { name: 'Navy Blue',     colorCode: '#000080', imageFiles: ['short-kurti-vertical-stripes-navy-blue-1'] },
    ],
  },

  {
    id: 'KUR010',
    name: 'Short Kurti',
    category: 'kurthi-set',
    price: 650,
    description: 'Cotton short kurti with ethnic block print in maroon. Closed collar with 3/4th sleeve.',
    fabric: 'Cotton',
    neckType: 'Closed Collar Neck',
    sleeveType: '3/4th Sleeve',
    length: '27 inches',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['M (36")', 'L (38")', 'XL (40")'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['short-kurti-ethnic-block-print-maroon-1'],
  },

  {
    id: 'KUR011',
    name: 'Short Kurti',
    category: 'kurthi-set',
    price: 650,
    description: 'Cotton short kurti with micro floral print in vibrant red. Closed collar with 3/4th sleeve.',
    fabric: 'Cotton',
    neckType: 'Closed Collar Neck',
    sleeveType: '3/4th Sleeve',
    length: '27 inches',
    occasion: ['Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['M (36")', 'L (38")', 'XL (40")'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'kurthi',
    imageFiles: ['short-kurti-micro-floral-print-red-1'],
  },

  // ════════════════════════════════════════════════════════
  // COTTON SAREE
  // ════════════════════════════════════════════════════════

  {
    id: 'COT001',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 800,
    description: 'Kalyani cotton saree with large checks and zari border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Zari Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-large-checks-border-1'],
  },

  {
    id: 'COT002',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 675,
    description: 'Kalyani cotton saree with fine checks and zari border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Zari Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-fine-checks-border-1'],
  },

  {
    id: 'COT003',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 675,
    description: 'Kalyani cotton saree with classic tartan checks and zari border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Zari Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: true,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-tartan-checks-1'],
  },

  {
    id: 'COT004',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 775,
    description: 'Kalyani cotton saree with diagonal checks and zari border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Zari Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: true, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-diagonal-checks-border-1'],
  },

  {
    id: 'COT005',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 775,
    description: 'Kalyani cotton saree with grid checks contrast and thread border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Thread Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-grid-checks-contrast-border-1'],
  },

  {
    id: 'COT006',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 825,
    description: 'Kalyani cotton saree with self checks and zari motif thread border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Thread Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-self-checks-zari-motif-1'],
  },

  {
    id: 'COT007',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 775,
    description: 'Kalyani cotton saree with small grid checks and thread border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Thread Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-small-grid-checks-1'],
  },

  {
    id: 'COT008',
    name: 'Kalyani Cotton Saree',
    category: 'cotton-saree',
    price: 850,
    description: 'Kalyani cotton saree with minimal checks motif and thread border. No blouse piece included.',
    fabric: 'Cotton',
    blouseIncluded: false,
    sareeLength: '5.5m',
    borderType: 'Thread Border',
    occasion: ['Party Wear', 'Regular Wear'],
    washCare: 'Normal wash',
    sizes: ['Free Size'],
    inStock: true, isFeatured: false, isNewArrival: false,
    folderKey: 'cotton',
    imageFiles: ['kalyani-cotton-saree-minimal-checks-motif-1'],
  },
]

// ── Main upload function ──────────────────────────────────────────────────────
async function uploadAllProducts() {
  console.log(`\n🚀 Starting upload of ${PRODUCTS.length} products...\n`)
  let success = 0, skipped = 0, failed = 0

  for (const product of PRODUCTS) {
    const docRef = db.collection('products').doc(product.id)
    const existing = await docRef.get()

    if (existing.exists) {
      console.log(`⏭  [${product.id}] Already exists — skipping`)
      skipped++
      continue
    }

    console.log(`\n📦 [${product.id}] ${product.name}`)

    try {
      const { id, folderKey, imageFiles, colors, ...productData } = product

      // Build the Firestore document
      const doc = {
        ...productData,
        createdAt: getFirestore.FieldValue?.serverTimestamp() ?? new Date(),
      }

      if (colors) {
        // Multi-color product
        const uploadedColors = []
        for (const color of colors) {
          console.log(`  🎨 Color: ${color.name}`)
          const urls = await uploadImages(folderKey, color.imageFiles, `${product.category}/${id}/${color.name.replace(/\s+/g, '-').toLowerCase()}`)
          uploadedColors.push({
            name:       color.name,
            colorCode:  color.colorCode,
            price:      product.price,
            images:     urls,
            inStock:    true,
          })
        }
        doc.colors = uploadedColors
        doc.images = uploadedColors[0]?.images ?? [] // default to first color's images
      } else {
        // Single-color product
        const urls = await uploadImages(folderKey, imageFiles, `${product.category}/${id}`)
        doc.images = urls
      }

      await docRef.set(doc)
      console.log(`  ✅ Saved to Firestore`)
      success++
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`)
      failed++
    }
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`✅ Success: ${success}  ⏭  Skipped: ${skipped}  ❌ Failed: ${failed}`)
  console.log(`${'─'.repeat(50)}\n`)
}

uploadAllProducts().then(() => process.exit(0)).catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})