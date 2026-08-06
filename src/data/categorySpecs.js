/**
 * CATEGORY SPECIFICATIONS
 * ─────────────────────────────────────────────────────────────
 * Migrated from your existing product-detail.js.
 * Used in <ProductInfo> to render the spec table and size chart
 * that is specific to each category.
 * ─────────────────────────────────────────────────────────────
 */

export const categorySpecs = {
  'tussar-saree': {
    label: 'Tussar Sarees',
    showSize: false,
    specFields: [
      { key: 'fabric',         label: 'Saree Fabric' },
      { key: 'blouseIncluded', label: 'Blouse Piece', format: (v) => (v === 'Yes' ? 'Included' : 'Not included') },
      { key: 'sareeLength',    label: 'Saree Length' },
      { key: 'blouseLength',   label: 'Blouse Length' },
      { key: 'borderType',     label: 'Border Type' },
      { key: 'occasion',       label: 'Occasion' },
      { key: 'washCare',       label: 'Care Instructions' },
    ],
    sizeNote: 'Tussar sarees are one-size. Length approximately 5.5m including blouse piece.',
    sizeChart: null,
  },
  'fancy-saree': {
    label: 'Fancy Sarees',
    showSize: false,
    specFields: [
      { key: 'fabric',         label: 'Saree Fabric' },
      { key: 'blouseIncluded', label: 'Blouse Piece', format: (v) => (v === 'Yes' ? 'Included' : 'Not included') },
      { key: 'sareeLength',    label: 'Saree Length' },
      { key: 'blouseLength',   label: 'Blouse Length' },
      { key: 'borderType',     label: 'Border Type' },
      { key: 'occasion',       label: 'Occasion' },
      { key: 'washCare',       label: 'Care Instructions' },
    ],
    sizeNote: 'Fancy sarees are one-size. Length approximately 5.5m including blouse piece.',
    sizeChart: null,
  },
  'cotton-saree': {
    label: 'Cotton Sarees',
    showSize: false,
    specFields: [
      { key: 'fabric',         label: 'Saree Fabric' },
      { key: 'blouseIncluded', label: 'Blouse Piece', format: (v) => (v === 'Yes' ? 'Included' : 'Not included') },
      { key: 'sareeLength',    label: 'Saree Length' },
      { key: 'blouseLength',   label: 'Blouse Length' },
      { key: 'borderType',     label: 'Border Type' },
      { key: 'occasion',       label: 'Occasion' },
      { key: 'washCare',       label: 'Care Instructions' },
    ],
    sizeNote: 'Cotton sarees are one-size. Length approximately 5.5m including blouse piece.',
    sizeChart: null,
  },
  'organza-saree': {
    label: 'Organza Sarees',
    showSize: false,
    specFields: [
      { key: 'fabric',         label: 'Saree Fabric' },
      { key: 'blouseIncluded', label: 'Blouse Piece', format: (v) => (v === 'Yes' ? 'Included' : 'Not included') },
      { key: 'sareeLength',    label: 'Saree Length' },
      { key: 'blouseLength',   label: 'Blouse Length' },
      { key: 'borderType',     label: 'Border Type' },
      { key: 'occasion',       label: 'Occasion' },
      { key: 'washCare',       label: 'Care Instructions' },
    ],
    sizeNote: 'Organza sarees are one-size. Length approximately 5.5m including blouse piece.',
    sizeChart: null,
  },
  'soft-silk-saree': {
    label: 'Soft Silk Sarees',
    showSize: false,
    specFields: [
      { key: 'silkType',       label: 'Silk Type' },
      { key: 'sareeLength',    label: 'Saree Length' },
      { key: 'blouseIncluded', label: 'Blouse Piece', format: (v) => (v === 'Yes' ? 'Included' : 'Not included') },
      { key: 'zariWork',       label: 'Zari Work' },
      { key: 'occasion',       label: 'Occasion' },
      { key: 'washCare',       label: 'Care Instructions' },
    ],
    sizeNote: 'Soft silk sarees are one-size. Length approximately 5.5m including blouse piece.',
    sizeChart: null,
  },
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

  'kurthi-set': {
    label: 'Kurthi Sets',
    showSize: true,
    specFields: [
      { key: 'fabric',      label: 'Fabric' },
      { key: 'neckType',    label: 'Neck Type' },
      { key: 'sleeveType',  label: 'Sleeve Type' },
      { key: 'length',      label: 'Length' },
      { key: 'pattern',     label: 'Pattern' },
      { key: 'setIncludes', label: 'Set Includes' },
      { key: 'occasion',    label: 'Occasion' },
      { key: 'washCare',    label: 'Care Instructions' },
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

  'unstitched-salwar': {
    label: 'Unstitched Salwar',
    showSize: false,
    specFields: [
      { key: 'topFabric',    label: 'Top Fabric' },
      { key: 'bottomFabric', label: 'Bottom Fabric' },
      { key: 'dupatta',      label: 'Dupatta' },
      { key: 'fabricLength', label: 'Fabric Length' },
      { key: 'setIncludes',  label: 'Set Includes' },
      { key: 'occasion',     label: 'Occasion' },
      { key: 'washCare',     label: 'Care Instructions' },
    ],
    sizeNote: 'Unstitched materials. Free size.',
    sizeChart: null,
  },

  'coord-sets': {
    label: "Co-ord Sets",
    showSize: true,
    specFields: [
      { key: 'fabric',       label: 'Fabric' },
      { key: 'topLength',    label: 'Top Length' },
      { key: 'bottomLength', label: 'Bottom Length' },
      { key: 'fitType',      label: 'Fit Type' },
      { key: 'sleeveType',   label: 'Sleeve Type' },
      { key: 'occasion',     label: 'Occasion' },
      { key: 'washCare',     label: 'Care Instructions' },
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