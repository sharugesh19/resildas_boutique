/**
 * CATEGORY SPECIFICATIONS
 * ─────────────────────────────────────────────────────────────
 * Migrated from your existing product-detail.js.
 * Used in <ProductInfo> to render the spec table and size chart
 * that is specific to each category.
 * ─────────────────────────────────────────────────────────────
 */

export const categorySpecs = {
  sarees: {
    label: 'Sarees',

    // Which product fields to display in the spec table, and how to format them
    specFields: [
      { key: 'fabric',           label: 'Fabric' },
      { key: 'setIncludes',      label: 'Set Includes' },
      { key: 'blouseIncluded',   label: 'Blouse', format: (v) => (v ? 'Included' : 'Not included') },
      { key: 'occasion',         label: 'Occasion', format: (v) => v.join(', ') },
      { key: 'careInstructions', label: 'Care Instructions' },
    ],

    // Shown below the spec table
    sizeNote: 'Sarees are one-size. Length approximately 5.5m – 6.5m including blouse piece.',
    sizeChart: null, // no size chart for sarees
  },

  'kurthi-sets': {
    label: 'Kurthi Sets',

    specFields: [
      { key: 'fabric',           label: 'Fabric' },
      { key: 'setIncludes',      label: 'Set Includes' },
      { key: 'occasion',         label: 'Occasion', format: (v) => v.join(', ') },
      { key: 'careInstructions', label: 'Care Instructions' },
    ],

    sizeNote: 'If you are between sizes, we recommend sizing up for a comfortable fit.',

    sizeChart: {
      headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Kurti Length (in)'],
      rows: [
        ['XS',  '32', '26', '36', '52'],
        ['S',   '34', '28', '38', '52'],
        ['M',   '36', '30', '40', '53'],
        ['L',   '38', '32', '42', '53'],
        ['XL',  '40', '34', '44', '54'],
        ['XXL', '42', '36', '46', '54'],
      ],
    },
  },

  'salwar-sets': {
    label: 'Salwar Sets',

    specFields: [
      { key: 'fabric',           label: 'Fabric' },
      { key: 'setIncludes',      label: 'Set Includes' },
      { key: 'occasion',         label: 'Occasion', format: (v) => v.join(', ') },
      { key: 'careInstructions', label: 'Care Instructions' },
    ],

    sizeNote: 'Salwar sets are designed for a relaxed fit. True to size.',

    sizeChart: {
      headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
      rows: [
        ['S',  '34', '28', '38'],
        ['M',  '36', '30', '40'],
        ['L',  '38', '32', '42'],
        ['XL', '40', '34', '44'],
      ],
    },
  },

  'coord-sets': {
    label: "Co-ord Sets",

    specFields: [
      { key: 'fabric',           label: 'Fabric' },
      { key: 'setIncludes',      label: 'Set Includes' },
      { key: 'occasion',         label: 'Occasion', format: (v) => v.join(', ') },
      { key: 'careInstructions', label: 'Care Instructions' },
    ],

    sizeNote: "Co-ord sets are true to size. Check measurements carefully for crop-top styles.",

    sizeChart: {
      headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
      rows: [
        ['XS', '32', '26', '36'],
        ['S',  '34', '28', '38'],
        ['M',  '36', '30', '40'],
        ['L',  '38', '32', '42'],
        ['XL', '40', '34', '44'],
      ],
    },
  },
}

/**
 * Returns the spec config for a given category slug,
 * or null if the category is unknown.
 */
export const getCategorySpec = (category) => categorySpecs[category] ?? null