import { useState } from 'react';
import { normalizeSizes } from '../utils/normalizeSizes';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function SizeStockEditor({ sizes, onChange }) {
  const list = normalizeSizes(sizes); // ← defends against strings/garbage every render
  const [customSize, setCustomSize] = useState('');

  function addSize(size) {
    const trimmed = typeof size === 'string' ? size.trim() : '';
    if (!trimmed) return;
    if (list.some((s) => s.size === trimmed)) return;
    onChange([...list, { size: trimmed, stock: 0 }]);
    setCustomSize('');
  }

  function removeSize(size) {
    onChange(list.filter((s) => s.size !== size));
  }

  function updateStock(size, stock) {
    const next = list.map((s) =>
      s.size === size ? { ...s, stock: stock === '' ? 0 : Number(stock) || 0 } : s
    );
    onChange(next);
  }

  const availableCommon = COMMON_SIZES.filter(
    (cs) => !list.some((s) => s.size === cs)
  );

  return (
    <div>
      {list.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {list.map((s, i) => (
            <div
              key={`${s.size}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid var(--admin-border, #e5e5e5)',
                borderRadius: 6,
                padding: '8px 10px',
              }}
            >
              <span style={{ minWidth: 90, fontWeight: 500 }}>{s.size}</span>
              <label style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Stock:</label>
              <input
                type="number"
                min={0}
                className="form-control"
                style={{ width: 90 }}
                value={s.stock}
                onChange={(e) => updateStock(s.size, e.target.value)}
              />
              {s.stock === 0 && (
                <span style={{ fontSize: 12, color: '#b91c1c' }}>Out of stock</span>
              )}
              <button
                type="button"
                onClick={() => removeSize(s.size)}
                className="btn btn-danger btn-sm"
                style={{ marginLeft: 'auto' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {availableCommon.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {availableCommon.map((cs) => (
            <button key={cs} type="button" onClick={() => addSize(cs)} className="btn btn-ghost btn-sm">
              + {cs}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          className="form-control"
          placeholder='Custom size e.g. L (36")'
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSize(customSize);
            }
          }}
        />
        <button type="button" onClick={() => addSize(customSize)} className="btn btn-ghost">
          + Add
        </button>
      </div>
    </div>
  );
}