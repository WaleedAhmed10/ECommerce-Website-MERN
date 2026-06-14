import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { LoadingSpinner, ErrorMessage, ProtectedRoute } from '../components/SharedComponents';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('products');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/orders')])
      .then(([pRes, oRes]) => {
        setProducts(pRes.data);
        setOrders(oRes.data);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}`, { status });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: data.status } : o)));
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/product')}>
          + Add Product
        </button>
      </div>
      {error && <ErrorMessage message={error} />}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('products')}>
          Products ({products.length})
        </button>
        <button className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('orders')}>
          Orders ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.imageUrl || 'https://via.placeholder.com/50'} alt={p.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                  </td>
                  <td style={{ maxWidth: 200 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{'★'.repeat(Math.round(p.rating))}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }}
                      onClick={() => navigate(`/admin/product/${p._id}`)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || '—'}<br /><span style={{ fontSize: '0.8rem', color: '#666' }}>{o.user?.email}</span></td>
                  <td>{o.items.length}</td>
                  <td>${o.total.toFixed(2)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                    >
                      {['pending', 'processing', 'shipped', 'delivered'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>;
}
