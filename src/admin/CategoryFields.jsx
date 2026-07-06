// src/admin/CategoryFields.jsx
//
// Renders category-specific spec fields only. Sizes/stock are handled
// entirely by the "Sizes & Stock" section in ProductForm.jsx (via
// SizeStockEditor), both at product level and per color — so this file
// no longer touches sizes at all.

function Field({ label, name, value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-control"
        type="text"
        value={value || ''}
        placeholder={label}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select
        className="form-control"
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

const f = (label, name) => ({ label, name });
const sf = (label, name, options) => ({ label, name, options });

// Keys match the SLUGS used in Firestore (product.category),
// same as CATEGORY_LABELS in src/data/productsData.js
const CATEGORY_CONFIG = {
  'unstitched-salwar': {
    fields: [
      f('Top Fabric', 'topFabric'),
      f('Bottom Fabric', 'bottomFabric'),
      f('Dupatta', 'dupatta'),
      f('Fabric Length', 'fabricLength'),
      f('Set Includes', 'setIncludes'),
      sf('Occasion', 'occasion', ['Regular Wear', 'Party Wear', 'Festival', 'Wedding']),
      f('Wash Care', 'washCare'),
    ],
  },
  'kurthi-set': {
    fields: [
      f('Fabric', 'fabric'),
      sf('Neck Type', 'neckType', ['Round Neck', 'V Neck', 'U Neck', 'Closed Collar Neck', 'Mandarin']),
      sf('Sleeve Type', 'sleeveType', ['Full Sleeve', 'Half Sleeve', '3/4th Sleeve', 'Sleeveless']),
      f('Length', 'length'),
      f('Pattern', 'pattern'),
      f('Set Includes', 'setIncludes'),
      sf('Occasion', 'occasion', ['Regular Wear', 'Office Wear', 'Festival', 'Party Wear']),
      f('Wash Care', 'washCare'),
    ],
  },
  'organza-saree': {
    fields: [
      f('Fabric', 'fabric'),
      sf('Blouse Included', 'blouseIncluded', ['Yes', 'No']),
      f('Saree Length', 'sareeLength'),
      f('Blouse Length', 'blouseLength'),
      f('Border Type', 'borderType'),
      sf('Occasion', 'occasion', ['Party Wear', 'Wedding', 'Festival', 'Regular Wear']),
      f('Wash Care', 'washCare'),
    ],
  },
  'tussar-saree': {
    fields: [
      f('Fabric', 'fabric'),
      f('Weave Type', 'weaveType'),
      sf('Blouse Included', 'blouseIncluded', ['Yes', 'No']),
      f('Saree Length', 'sareeLength'),
      f('Border Type', 'borderType'),
      sf('Occasion', 'occasion', ['Festival', 'Wedding', 'Party Wear', 'Regular Wear']),
      f('Wash Care', 'washCare'),
    ],
  },
  'soft-silk-saree': {
    fields: [
      sf('Silk Type', 'silkType', ['Kanjivaram', 'Mysore Silk', 'Banarasi', 'Gadwal', 'Patola', 'Pure Silk']),
      f('Saree Length', 'sareeLength'),
      sf('Blouse Included', 'blouseIncluded', ['Yes', 'No']),
      sf('Zari Work', 'zariWork', ['Pure Zari', 'Half Fine Zari', 'Tested Zari', 'No Zari']),
      sf('Occasion', 'occasion', ['Wedding', 'Festival', 'Party Wear']),
      f('Wash Care', 'washCare'),
    ],
  },
  'cotton-saree': {
    fields: [
      f('Fabric', 'fabric'),
      f('Saree Length', 'sareeLength'),
      sf('Blouse Included', 'blouseIncluded', ['Yes', 'No']),
      f('Border Type', 'borderType'),
      sf('Occasion', 'occasion', ['Regular Wear', 'Office Wear', 'Party Wear', 'Puja']),
      f('Wash Care', 'washCare'),
    ],
  },
  'fancy-saree': {
    fields: [
      f('Fabric', 'fabric'),
      f('Embellishment', 'embellishment'),
      sf('Blouse Included', 'blouseIncluded', ['Yes', 'No']),
      f('Saree Length', 'sareeLength'),
      sf('Occasion', 'occasion', ['Party Wear', 'Wedding', 'Reception', 'Festival']),
      f('Wash Care', 'washCare'),
    ],
  },
  'coord-sets': {
    fields: [
      f('Fabric', 'fabric'),
      f('Top Length', 'topLength'),
      f('Bottom Length', 'bottomLength'),
      sf('Fit Type', 'fitType', ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized']),
      sf('Sleeve Type', 'sleeveType', ['Full Sleeve', 'Half Sleeve', '3/4th Sleeve', 'Sleeveless']),
      sf('Occasion', 'occasion', ['Casual', 'Party Wear', 'Festival']),
      f('Wash Care', 'washCare'),
    ],
  },
};

export default function CategoryFields({ category, specs, onChange }) {
  const config = CATEGORY_CONFIG[category];
  if (!config) return null;

  return (
    <>
      {config.fields.map((field) =>
        field.options ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            value={specs[field.name]}
            onChange={onChange}
            options={field.options}
          />
        ) : (
          <Field
            key={field.name}
            label={field.label}
            name={field.name}
            value={specs[field.name]}
            onChange={onChange}
          />
        )
      )}
    </>
  );
}