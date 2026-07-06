// src/admin/ProductForm.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import CategoryFields from './CategoryFields';
import ColorVariants from './ColorVariants';
import ImageUploader from './ImageUploader';

// value = slug stored in Firestore (matches CATEGORY_LABELS in src/data/productsData.js)
// label = shown to the admin
const CATEGORIES = [
  { value: 'unstitched-salwar', label: 'Unstitched Salwar Set' },
  { value: 'kurthi-set',        label: 'Kurthi Set' },
  { value: 'organza-saree',     label: 'Organza Saree' },
  { value: 'tussar-saree',      label: 'Tussar Saree' },
  { value: 'soft-silk-saree',   label: 'Soft Silk Saree' },
  { value: 'cotton-saree',      label: 'Cotton Saree' },
  { value: 'fancy-saree',       label: 'Fancy Saree' },
  { value: 'coord-sets',        label: 'Co-ord Sets' },
];

const BADGES = [
  { value: 'none',       label: 'None' },
  { value: 'bestseller', label: 'Best Seller (isFeatured)' },
  { value: 'new',        label: 'New Arrival (isNewArrival)' },
];

const EMPTY = {
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  stock: '',
  inStock: true,
  badge: 'none',
  description: '',
  sizes: [],
  images: [],
  colors: [],
  specs: {},
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Load existing product
  useEffect(() => {
    if (!isEdit) return;
    getDoc(doc(db, 'products', id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();

        // Pull known spec fields (everything except the fields we manage
        // explicitly) into `specs` so CategoryFields can edit them,
        // since real product docs store these as flat top-level fields.
        const KNOWN = new Set([
          'name', 'category', 'price', 'originalPrice', 'stock', 'inStock',
          'isFeatured', 'isNewArrival', 'description', 'sizes', 'images',
          'colors', 'createdAt', 'updatedAt',
        ]);
        const specs = {};
        Object.keys(data).forEach((key) => {
          if (!KNOWN.has(key)) specs[key] = data[key];
        });

        const badge = data.isFeatured ? 'bestseller' : data.isNewArrival ? 'new' : 'none';

        setForm({
          ...EMPTY,
          name: data.name || '',
          category: data.category || '',
          price: data.price ?? '',
          originalPrice: data.originalPrice ?? '',
          stock: data.stock ?? '',
          inStock: data.inStock ?? true,
          badge,
          description: data.description || '',
          sizes: data.sizes || [],
          images: data.images || [],
          colors: data.colors || [],
          specs,
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setSpec(key, value) {
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
  }

  // Colors need number coercion + blank-price fallback before saving,
  // since the inputs are free-text/number fields that default to ''.
  function cleanColors(colors) {
    return colors
      .filter((c) => c.name && c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        colorCode: c.colorCode || '#000000',
        price: c.price === '' || c.price == null ? undefined : Number(c.price),
        originalPrice: c.originalPrice === '' || c.originalPrice == null ? undefined : Number(c.originalPrice),
        images: c.images || [],
        inStock: Boolean(c.inStock),
      }))
      // Drop undefined keys so Firestore doesn't store literal `undefined`
      // (it would actually throw) — omit price/originalPrice entirely when
      // blank, so ProductDetail.jsx's `?? product.price` fallback kicks in.
      .map((c) => {
        const clean = { ...c };
        if (clean.price === undefined) delete clean.price;
        if (clean.originalPrice === undefined) delete clean.originalPrice;
        return clean;
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      setMsg({ type: 'error', text: 'Name, category, and price are required.' });
      return;
    }
    if (form.colors.some((c) => c.name && c.name.trim() === '')) {
      setMsg({ type: 'error', text: 'Every color variant needs a name, or remove the empty one.' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,          // slug — matches storefront
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: form.stock === '' ? null : Number(form.stock),
        inStock: Boolean(form.inStock),    // ← storefront's Add to Cart reads this
        isFeatured: form.badge === 'bestseller',
        isNewArrival: form.badge === 'new',
        description: form.description.trim(),
        sizes: form.sizes,
        images: form.images,
        colors: cleanColors(form.colors), // ← per-color price/images/stock overrides
        ...form.specs,                     // ← flattened, matches ProductDetail.jsx reads
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'products', id), payload);
        setMsg({ type: 'success', text: 'Product updated successfully.' });
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), payload);
        setMsg({ type: 'success', text: 'Product added successfully.' });
        setTimeout(() => navigate('/admin/products'), 1200);
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Save failed: ' + err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
        <p style={{ marginTop: 12 }}>Loading product…</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <p>{isEdit ? `Editing: ${form.name}` : 'Fill in the details below.'}</p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="btn btn-ghost">
          ← Back
        </button>
      </div>

      {msg && <div className={`admin-alert ${msg.type}`}>{msg.text}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* ── Basic Info ──────────────────────── */}
        <div className="form-section">
          <div className="form-section-header"><h3>Basic Information</h3></div>
          <div className="form-section-body">
            <div className="form-group form-control-full">
              <label>Product Name *</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Royal Blue Organza Saree"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Badge</label>
                <select
                  className="form-control"
                  value={form.badge}
                  onChange={(e) => set('badge', e.target.value)}
                >
                  {BADGES.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group form-control-full">
              <label>Description</label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Write a compelling product description…"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* ── Pricing & Stock ─────────────────── */}
        <div className="form-section">
          <div className="form-section-header"><h3>Pricing & Inventory (base / default color)</h3></div>
          <div className="form-section-body">
            <div className="form-row-3">
              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="1299"
                  required
                />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={form.originalPrice}
                  onChange={(e) => set('originalPrice', e.target.value)}
                  placeholder="1799 (leave blank if no discount)"
                />
              </div>
              <div className="form-group">
                <label>Stock Qty (optional)</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>In Stock — shown as buyable on the store? *</label>
              <select
                className="form-control"
                value={form.inStock ? 'yes' : 'no'}
                onChange={(e) => set('inStock', e.target.value === 'yes')}
              >
                <option value="yes">Yes — customers can buy it</option>
                <option value="no">No — Out of Stock</option>
              </select>
            </div>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
              If this product has color variants below, each variant's own price
              and stock status will override these base values on the product page.
            </p>
          </div>
        </div>

        {/* ── Images ──────────────────────────── */}
        <div className="form-section">
          <div className="form-section-header"><h3>Product Images (default, used if no color selected)</h3></div>
          <div className="form-section-body" style={{ display: 'block' }}>
            <ImageUploader
              images={form.images}
              onChange={(urls) => set('images', urls)}
              folder="products"
            />
          </div>
        </div>

        {/* ── Color Variants ──────────────────── */}
        <ColorVariants
          colors={form.colors}
          onChange={(colors) => set('colors', colors)}
        />

        {/* ── Category-Specific Fields ─────────── */}
        {form.category && (
          <div className="form-section">
            <div className="form-section-header">
              <h3>{CATEGORIES.find((c) => c.value === form.category)?.label} — Specifications</h3>
            </div>
            <div className="form-section-body">
              <CategoryFields
                category={form.category}
                specs={form.specs}
                onChange={setSpec}
                sizes={form.sizes}
                onSizesChange={(s) => set('sizes', s)}
              />
            </div>
          </div>
        )}

        {/* ── Submit ──────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </>
  );
}