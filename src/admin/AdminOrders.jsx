// src/admin/AdminOrders.jsx
import { useEffect, useState, useMemo } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ORDER_STATUSES = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_CLASS = {
  placed: 'pill-placed',
  processing: 'pill-processing',
  shipped: 'pill-shipped',
  delivered: 'pill-delivered',
  cancelled: 'pill-cancelled',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [msg, setMsg] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === 'all' || (o.orderStatus || 'placed') === statusFilter;

      if (!matchesStatus) return false;

      if (!search.trim()) return true;

      const term = search.trim().toLowerCase();
      const customerName = (o.customerName || o.name || '').toLowerCase();
      const phone = (o.phone || '').toLowerCase();
      const orderId = o.id.toLowerCase();

      return (
        customerName.includes(term) ||
        phone.includes(term) ||
        orderId.includes(term)
      );
    });
  }, [orders, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      );
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setSaving(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: new Date(),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showMsg('success', 'Order status updated.');
    } catch (e) {
      showMsg('error', 'Failed to update: ' + e.message);
    } finally {
      setSaving(null);
    }
  }

  function showMsg(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  }

  const fmt = (n) =>
    '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const fmtDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Orders</h2>
          <p>
            {filteredOrders.length === orders.length
              ? `${orders.length} orders total`
              : `Showing ${filteredOrders.length} of ${orders.length} orders`}
          </p>
        </div>
        <button onClick={fetchOrders} className="btn btn-ghost">
          ↻ Refresh
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Search by customer name, phone, or order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <select
          className="form-control status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {msg && <div className={`admin-alert ${msg.type}`}>{msg.text}</div>}

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="loading-row">
                  <td colSpan={8}>Loading orders…</td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr className="loading-row">
                  <td colSpan={8}>
                    {orders.length === 0
                      ? 'No orders found.'
                      : 'No orders match your search/filter.'}
                  </td>
                </tr>
              )}
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <code style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
                      #{o.id.slice(0, 8).toUpperCase()}
                    </code>
                  </td>
                  <td><strong>{o.customerName || o.name || '—'}</strong></td>
                  <td>{o.phone || '—'}</td>
                  <td><strong>{fmt(o.total)}</strong></td>
                  <td>
                    <span
                      className={`pill ${
                        o.paymentMethod === 'prepaid' ? 'pill-paid' : 'pill-cod'
                      }`}
                    >
                      {o.paymentMethod === 'prepaid' ? 'Paid' : 'COD'}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${STATUS_CLASS[o.orderStatus] || 'pill-placed'}`}>
                      {o.orderStatus || 'placed'}
                    </span>
                  </td>
                  <td>{fmtDate(o.createdAt)}</td>
                  <td>
                    {saving === o.id ? (
                      <span className="spinner" />
                    ) : (
                      <select
                        className="status-select"
                        value={o.orderStatus || 'placed'}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}