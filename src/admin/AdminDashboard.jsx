// src/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom';

const STATUS_CLASS = {
  placed: 'pill-placed',
  processing: 'pill-processing',
  shipped: 'pill-shipped',
  delivered: 'pill-delivered',
  cancelled: 'pill-cancelled',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    pending: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Products
        const prodSnap = await getDocs(collection(db, 'products'));
        const products = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Orders
        const ordSnap = await getDocs(
          query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        );
        const orders = ordSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const revenue = orders
          .filter((o) => o.orderStatus !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const pending = orders.filter(
          (o) => o.orderStatus === 'placed' || o.orderStatus === 'processing'
        ).length;

        setStats({
          products: products.length,
          orders: orders.length,
          revenue,
          pending,
        });

        setRecentOrders(orders.slice(0, 6));
        setLowStock(products.filter((p) => (p.stock ?? 0) < 5).slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fmt = (n) =>
    '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const fmtDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back — here's what's happening today.</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {/* ── Stat Cards ──────────────────────── */}
      <div className="stat-grid">
        {[
          { label: 'Total Products', value: stats.products, sub: 'in catalogue' },
          { label: 'Total Orders', value: stats.orders, sub: 'all time' },
          { label: 'Total Revenue', value: fmt(stats.revenue), sub: 'excl. cancelled' },
          { label: 'Pending Orders', value: stats.pending, sub: 'placed + processing' },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{loading ? '…' : s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Two Columns ─────────────────────── */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr className="loading-row">
                    <td colSpan={4}>Loading…</td>
                  </tr>
                )}
                {!loading && recentOrders.length === 0 && (
                  <tr className="loading-row">
                    <td colSpan={4}>No orders yet.</td>
                  </tr>
                )}
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.customerName || o.name || '—'}</strong></td>
                    <td>{fmt(o.total || 0)}</td>
                    <td>
                      <span className={`pill ${STATUS_CLASS[o.orderStatus] || 'pill-placed'}`}>
                        {o.orderStatus || 'placed'}
                      </span>
                    </td>
                    <td>{fmtDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Low Stock Alert</h3>
            <Link to="/admin/products" className="btn btn-ghost btn-sm">Manage</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr className="loading-row">
                    <td colSpan={3}>Loading…</td>
                  </tr>
                )}
                {!loading && lowStock.length === 0 && (
                  <tr className="loading-row">
                    <td colSpan={3}>All products well-stocked ✓</td>
                  </tr>
                )}
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category}</td>
                    <td className="low-stock">{p.stock ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}