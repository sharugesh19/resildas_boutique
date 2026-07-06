// src/admin/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const NAV = [
  {
    label: 'Main',
    items: [
      {
        to: '/admin',
        end: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
        label: 'Dashboard',
      },
    ],
  },
  {
    label: 'Store',
    items: [
      {
        to: '/admin/orders',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
            <path d="M13 21l2.5-2.5M21 13l-6 6-3-3" />
          </svg>
        ),
        label: 'Orders',
      },
      {
        to: '/admin/products',
        end: true, // ← added: without this, /admin/products/add also matched, lighting up both links
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        ),
        label: 'Products',
      },
      {
        to: '/admin/products/add',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        ),
        label: 'Add Product',
      },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="admin-root admin-shell">
      {/* ── Sidebar ──────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h1>Resilda's Boutique</h1>
          <span>Admin Console</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((section) => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    'sidebar-link' + (isActive ? ' active' : '')
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Topbar ───────────────────────── */}
      <header className="admin-topbar">
        <span className="topbar-title">Admin Panel</span>
        <div className="topbar-right">
          <span className="topbar-admin-badge">● Administrator</span>
        </div>
      </header>

      {/* ── Page Content ─────────────────── */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}