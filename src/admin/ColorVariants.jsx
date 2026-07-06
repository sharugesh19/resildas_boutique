// src/admin/ColorVariants.jsx
//
// Manages product.colors — matches the real schema used in productsData.js:
// { name, colorCode, price, originalPrice, images: [], inStock }
//
// Each color variant can have its own price/originalPrice/images/stock,
// independent of the base product (e.g. SAL002's "Olive Green" vs "Red",
// or ORG001 where "Golden Yellow" is priced higher than the other colors).

import ImageUploader from './ImageUploader';

const EMPTY_COLOR = {
  name: '',
  colorCode: '#000000',
  price: '',
  originalPrice: '',
  images: [],
  inStock: true,
};

export default function ColorVariants({ colors, onChange }) {
  const list = colors || [];

  function addColor() {
    onChange([...list, { ...EMPTY_COLOR }]);
  }

  function updateColor(index, key, value) {
    const next = list.map((c, i) => (i === index ? { ...c, [key]: value } : c));
    onChange(next);
  }

  function removeColor(index) {
    onChange(list.filter((_, i) => i !== index));
  }

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3>Color Variants (optional)</h3>
      </div>
      <div className="form-section-body" style={{ display: 'block' }}>
        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 16 }}>
          Add a color variant only if this product comes in multiple colors with
          separate images. Leave empty for single-color products — price and images
          set above will be used as-is. Each variant can have its own price and
          stock status, overriding the base product's price for that color.
        </p>

        {list.map((color, i) => (
          <div
            key={i}
            style={{
              border: '1px solid var(--admin-border, #e5e5e5)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong>Variant {i + 1}{color.name ? `: ${color.name}` : ''}</strong>
              <button
                type="button"
                onClick={() => removeColor(i)}
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Color Name *</label>
                <input
                  className="form-control"
                  type="text"
                  value={color.name}
                  onChange={(e) => updateColor(i, 'name', e.target.value)}
                  placeholder="e.g. Olive Green"
                />
              </div>
              <div className="form-group">
                <label>Color Swatch</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={color.colorCode || '#000000'}
                    onChange={(e) => updateColor(i, 'colorCode', e.target.value)}
                    style={{ width: 44, height: 38, padding: 2, border: '1px solid #ccc', borderRadius: 6 }}
                  />
                  <input
                    className="form-control"
                    type="text"
                    value={color.colorCode || ''}
                    onChange={(e) => updateColor(i, 'colorCode', e.target.value)}
                    placeholder="#708238"
                  />
                </div>
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Price for this color (₹)</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={color.price}
                  onChange={(e) => updateColor(i, 'price', e.target.value)}
                  placeholder="Leave blank to use base price"
                />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={color.originalPrice}
                  onChange={(e) => updateColor(i, 'originalPrice', e.target.value)}
                  placeholder="Leave blank to use base price"
                />
              </div>
              <div className="form-group">
                <label>Stock Status</label>
                <select
                  className="form-control"
                  value={color.inStock ? 'yes' : 'no'}
                  onChange={(e) => updateColor(i, 'inStock', e.target.value === 'yes')}
                >
                  <option value="yes">In Stock</option>
                  <option value="no">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="form-group form-control-full" style={{ marginTop: 8 }}>
              <label>Images for this color</label>
              <ImageUploader
                images={color.images}
                onChange={(urls) => updateColor(i, 'images', urls)}
                folder="products"
              />
            </div>
          </div>
        ))}

        <button type="button" onClick={addColor} className="btn btn-ghost">
          + Add Color Variant
        </button>
      </div>
    </div>
  );
}