// src/admin/AdminProducts.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom';

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

const BADGE_CLASS = {
  new: 'pill-new',
  bestseller: 'pill-bestseller',
  sale: 'pill-sale',
  none: 'pill-none',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let list = [...products];
    if (catFilter) list = list.filter((p) => p.category === catFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(s) ||
          (p.sku || '').toLowerCase().includes(s)
      );
    }
    setFiltered(list);
  }, [products, search, catFilter]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      );
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Try deleting images from storage
      const images = deleteTarget.images || [];
      for (const url of images) {
        try {
          const imgRef = ref(storage, url);
          await deleteObject(imgRef);
        } catch (_) {
          // ignore missing images
        }
      }
      await deleteDoc(doc(db, 'products', deleteTarget.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showMsg('success', `"${deleteTarget.name}" deleted.`);
    } catch (e) {
      showMsg('error', 'Delete failed: ' + e.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  function showMsg(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  }

  const fmt = (n) =>
    '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Products</h2>
          <p>{filtered.length} product{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">+ Add Product</Link>
      </div>

      {msg && <div className={`admin-alert ${msg.type}`}>{msg.text}</div>}

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="form-control"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ maxWidth: 220 }}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={fetchProducts} className="btn btn-ghost">↻</button>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="loading-row"><td colSpan={7}>Loading products…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr className="loading-row"><td colSpan={7}>No products found.</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.mainImage || (p.images && p.images[0]) ? (
                      <img
                        src={p.mainImage || p.images[0]}
                        alt={p.name}
                        className="product-thumb"
                      />
                    ) : (
                      <div className="product-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--admin-text-muted)' }}>
                        No img
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.sku && (
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                        SKU: {p.sku}
                      </div>
                    )}
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <strong>{fmt(p.price)}</strong>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textDecoration: 'line-through' }}>
                        {fmt(p.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className={p.stock < 5 ? 'low-stock' : ''}>{p.stock ?? '—'}</td>
                  <td>
                    <span className={`pill ${BADGE_CLASS[p.badge] || 'pill-none'}`}>
                      {p.badge || 'none'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Product?</h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: 14, marginTop: 8 }}>
              This will permanently delete <strong style={{ color: 'var(--admin-text)' }}>{deleteTarget.name}</strong> and all its images from Storage. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}