// src/admin/AdminProducts.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom';
import { RefreshIcon } from '../components/common/Icons';
import { invalidateProductsCache } from '../hooks/useProducts';



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
      list = list.filter((p) => (p.name || '').toLowerCase().includes(s));
    }
    setFiltered(list);
  }, [products, search, catFilter]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      );
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const images = [...(deleteTarget.images || [])];
      if (Array.isArray(deleteTarget.colors)) {
        deleteTarget.colors.forEach((c) => {
          if (Array.isArray(c.images)) {
            images.push(...c.images);
          }
        });
      }
      const uniqueImages = Array.from(new Set(images));
      for (const url of uniqueImages) {
        try {
          await deleteObject(ref(storage, url));
        } catch { /* ignore missing images */ }
      }
      await deleteDoc(doc(db, 'products', deleteTarget.id));
      await invalidateProductsCache();   // push removal to all open pages
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

  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const categoryLabel = (slug) => CATEGORIES.find((c) => c.value === slug)?.label || slug;

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

      <div className="filters-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="form-control"
            placeholder="Search by name…"
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
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button onClick={fetchProducts} className="btn btn-ghost"><RefreshIcon size={16} /></button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
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
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="product-thumb" />
                    ) : (
                      <div className="product-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--admin-text-muted)' }}>
                        No img
                      </div>
                    )}
                  </td>
                  <td><strong>{p.name}</strong></td>
                  <td>{categoryLabel(p.category)}</td>
                  <td>
                    <strong>{fmt(p.price)}</strong>
                    {p.originalPrice > p.price && (
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textDecoration: 'line-through' }}>
                        {fmt(p.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`pill ${p.inStock ? 'pill-delivered' : 'pill-cancelled'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${p.isFeatured ? 'pill-bestseller' : p.isNewArrival ? 'pill-new' : 'pill-none'}`}>
                      {p.isFeatured ? 'Best Seller' : p.isNewArrival ? 'New' : 'None'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/admin/products/edit/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button onClick={() => setDeleteTarget(p)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Product?</h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: 14, marginTop: 8 }}>
              This will permanently delete <strong style={{ color: 'var(--admin-text)' }}>{deleteTarget.name}</strong> and all its images from Storage. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}