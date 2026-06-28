// src/admin/CategoryFields.jsx

/**
 * Renders category-specific spec fields.
 * Props:
 *   category: string
 *   specs: object
 *   onChange: (key, value) => void
 *   sizes: string[]
 *   onSizesChange: (sizes) => void
 */

const SIZES_ALL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {type === 'select' ? null : (
        <input
          className="form-control"
          type="text"
          value={value || ''}
          placeholder={label}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
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

function SizePicker({ sizes, onChange }) {
  const toggle = (s) => {
    const next = sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s];
    onChange(next);
  };
  return (
    <div className="form-group form-control-full">
      <label>Available Sizes</label>
      <div className="sizes-grid">
        {SIZES_ALL.map((s) => (
          <div
            key={s}
            className={`size-chip ${sizes.includes(s) ? 'active' : ''}`}
            onClick={() => toggle(s)}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

const f = (label, name) => ({ label, name });
const sf = (label, name, options) => ({ label, name, options });

const CATEGORY_CONFIG = {
  'Unstitched Salwar Set': {
    hasSizes: false,
    fields: [
      f('Top Fabric', 'topFabric'),
      f('Bottom Fabric', 'bottomFabric'),
      f('Dupatta Fabric', 'dupattaFabric'),
      f('Work Type', 'workType'),
      f('Fabric Length', 'fabricLength'),
      sf('Occasion', 'occasion', ['Casual', 'Festive', 'Wedding', 'Party', 'Daily Wear']),
      sf('Wash Care', 'washCare', ['Dry Clean Only', 'Hand Wash', 'Machine Wash Cold', 'Gentle Wash']),
      f('Package Contents', 'packageContents'),
    ],
  },
  'Kurthi Set': {
    hasSizes: true,
    fields: [
      f('Fabric', 'fabric'),
      sf('Neck Type', 'neckType', ['Round Neck', 'V Neck', 'Mandarin', 'Square Neck', 'Sweetheart']),
      sf('Sleeve Type', 'sleeveType', ['Full Sleeve', 'Half Sleeve', '3/4 Sleeve', 'Sleeveless', 'Bell Sleeve']),
      sf('Length', 'length', ['Short', 'Knee Length', 'Calf Length', 'Full Length', 'Tunic']),
      sf('Fit', 'fit', ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Flared']),
      f('Pattern', 'pattern'),
      sf('Occasion', 'occasion', ['Casual', 'Festive', 'Office Wear', 'Party', 'Daily Wear']),
      sf('Wash Care', 'washCare', ['Dry Clean Only', 'Hand Wash', 'Machine Wash Cold', 'Gentle Wash']),
    ],
  },
  'Organza Saree': {
    hasSizes: false,
    fields: [
      f('Saree Fabric', 'sareeFabric'),
      sf('Blouse Piece Included', 'blousePiece', ['Yes', 'No']),
      f('Saree Length', 'sareeLength'),
      f('Blouse Length', 'blouseLength'),
      f('Border Type', 'borderType'),
      f('Work Type', 'workType'),
      sf('Occasion', 'occasion', ['Casual', 'Festive', 'Wedding', 'Party', 'Daily Wear']),
      f('Care Instructions', 'careInstructions'),
    ],
  },
  'Tussar Saree': {
    hasSizes: false,
    fields: [
      f('Saree Fabric', 'sareeFabric'),
      f('Weave Type', 'weaveType'),
      sf('Blouse Piece Included', 'blousePiece', ['Yes', 'No']),
      f('Saree Length', 'sareeLength'),
      f('Border Type', 'borderType'),
      sf('Occasion', 'occasion', ['Casual', 'Festive', 'Wedding', 'Party', 'Daily Wear']),
      f('Care Instructions', 'careInstructions'),
    ],
  },
  'Soft Silk Saree': {
    hasSizes: false,
    fields: [
      sf('Silk Type', 'silkType', ['Kanjivaram', 'Mysore Silk', 'Banarasi', 'Gadwal', 'Patola', 'Pure Silk']),
      f('Saree Length', 'sareeLength'),
      sf('Blouse Piece Included', 'blousePiece', ['Yes', 'No']),
      sf('Zari Work', 'zariWork', ['Pure Zari', 'Half Fine Zari', 'Tested Zari', 'No Zari']),
      sf('Occasion', 'occasion', ['Wedding', 'Festive', 'Party', 'Casual']),
      f('Care Instructions', 'careInstructions'),
    ],
  },
  'Cotton Saree': {
    hasSizes: false,
    fields: [
      f('Fabric', 'fabric'),
      f('Saree Length', 'sareeLength'),
      sf('Blouse Piece Included', 'blousePiece', ['Yes', 'No']),
      f('Weave Pattern', 'weavePattern'),
      sf('Occasion', 'occasion', ['Casual', 'Daily Wear', 'Office Wear', 'Festive']),
      f('Care Instructions', 'careInstructions'),
    ],
  },
  'Party Wear Saree': {
    hasSizes: false,
    fields: [
      f('Fabric', 'fabric'),
      f('Embellishment', 'embellishment'),
      sf('Sequins / Stone Work', 'sequinsWork', ['Heavy', 'Medium', 'Light', 'None']),
      sf('Blouse Piece Included', 'blousePiece', ['Yes', 'No']),
      f('Saree Length', 'sareeLength'),
      sf('Occasion', 'occasion', ['Party', 'Wedding', 'Festive', 'Reception']),
      f('Care Instructions', 'careInstructions'),
    ],
  },
  'Co-ord Sets': {
    hasSizes: true,
    fields: [
      f('Fabric', 'fabric'),
      f('Top Length', 'topLength'),
      f('Bottom Length', 'bottomLength'),
      sf('Fit Type', 'fitType', ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized']),
      sf('Sleeve Type', 'sleeveType', ['Full Sleeve', 'Half Sleeve', '3/4 Sleeve', 'Sleeveless', 'Cap Sleeve']),
      sf('Occasion', 'occasion', ['Casual', 'Party', 'Festive', 'Beach', 'Office Wear']),
      f('Care Instructions', 'careInstructions'),
    ],
  },
};

export default function CategoryFields({ category, specs, onChange, sizes, onSizesChange }) {
  const config = CATEGORY_CONFIG[category];
  if (!config) return null;

  return (
    <>
      {config.hasSizes && (
        <SizePicker sizes={sizes} onChange={onSizesChange} />
      )}
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