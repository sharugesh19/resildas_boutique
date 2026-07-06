// src/admin/AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import ProductForm from './ProductForm';
import './admin.css';



function AdminGuard({ children }) {
  const [state, setState] = useState({ loading: true, user: null, isAdmin: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, user: null, isAdmin: false });
        return;
      }

      // Temporary: env-based check until Blaze + custom claims are set up
      const tokenResult = await user.getIdTokenResult(true);
      const isAdmin = tokenResult.claims.admin === true;

      setState({ loading: false, user, isAdmin });
    });
    return unsub;
  }, []);

  if (state.loading) {
    return (
      <div className="access-denied">
        <div className="spinner" />
        <p>Verifying access…</p>
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  if (!state.isAdmin) {
    return (
      <div className="access-denied admin-root">
        <h2>Access Denied</h2>
        <p>Your account <strong>{state.user.email}</strong> does not have admin privileges.</p>
        <a href="/" className="btn btn-ghost" style={{ marginTop: 8 }}>← Back to Store</a>
      </div>
    );
  }

  return children;
}

export default function AdminRoutes() {
  return (
    <AdminGuard>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminGuard>
  );
}