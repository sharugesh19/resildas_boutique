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
import ImageUploader from './ImageUploader';

const CATEGORIES = [
  'Unstitched Salwar Set',
  'Kurthi Set',
  'Organza Saree',
  'Tussar Saree',
  'Soft Silk Saree',
  'Cotton Saree',
  'Party Wear Saree',
  'Co-ord Sets',
];

const BADGES = ['none', 'new', 'bestseller', 'sale'];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMPTY = {
  name: '',
  slug: '',
  category: '',
  price: '',
  originalPrice: '',
  sku: '',
  stock: '',
  badge: 'none',
  description: '',
  sizes: [],
  images: [],
  specs: {},
  isActive: true,
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
        setForm({
          ...EMPTY,
          ...data,
          sizes: data.sizes || [],
          images: data.images || [],
          specs: data.specs || {},
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  // Auto-slug
  useEffect(() => {
    if (!isEdit) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [form.name, isEdit]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setSpec(key, value) {
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      setMsg({ type: 'error', text: 'Name, category, and price are required.' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        category: form.category,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        sku: form.sku.trim(),
        stock: Number(form.stock) || 0,
        badge: form.badge || 'none',
        description: form.description.trim(),
        sizes: form.sizes,
        images: form.images,
        mainImage: form.images[0] || '',
        specs: form.specs,
        isActive: form.isActive,
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
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Royal Blue Organza Saree"
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug (URL)</label>
                <input
                  className="form-control"
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  placeholder="auto-generated"
                />
              </div>
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
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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
                    <option key={b} value={b}>
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </option>
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
          <div className="form-section-header"><h3>Pricing & Inventory</h3></div>
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
                  placeholder="1799"
                />
              </div>
              <div className="form-group">
                <label>Stock Qty</label>
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

            <div className="form-row">
              <div className="form-group">
                <label>Product SKU / Code</label>
                <input
                  className="form-control"
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value)}
                  placeholder="RB-ORG-001"
                />
              </div>
              <div className="form-group">
                <label>Active / Visible</label>
                <select
                  className="form-control"
                  value={form.isActive ? 'yes' : 'no'}
                  onChange={(e) => set('isActive', e.target.value === 'yes')}
                >
                  <option value="yes">Yes — Show on Store</option>
                  <option value="no">No — Hidden</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Images ──────────────────────────── */}
        <div className="form-section">
          <div className="form-section-header"><h3>Product Images</h3></div>
          <div className="form-section-body" style={{ display: 'block' }}>
            <ImageUploader
              images={form.images}
              onChange={(urls) => set('images', urls)}
              folder="products"
            />
          </div>
        </div>

        {/* ── Category-Specific Fields ─────────── */}
        {form.category && (
          <div className="form-section">
            <div className="form-section-header">
              <h3>{form.category} — Specifications</h3>
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