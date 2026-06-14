import { useEffect, useState } from 'react';
import api from '../utils/api';
import { LoadingSpinner, ErrorMessage, ProtectedRoute } from '../components/SharedComponents';

function statusClass(s) {
  return `status-badge status-${s}`;
}

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div className="page-header">
        <h2>My Orders</h2>
      </div>
      {error && <ErrorMessage message={error} />}
      {orders.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
          You haven't placed any orders yet.
        </div>
      )}
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div>
              <strong>Order ID:</strong> {order._id.slice(-8).toUpperCase()}<br />
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={statusClass(order.status)}>{order.status.toUpperCase()}</span><br />
              <strong style={{ fontSize: '1.1rem' }}>Total: ${order.total.toFixed(2)}</strong>
            </div>
          </div>
          <div>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <img
                  src={item.product?.imageUrl || 'https://via.placeholder.com/50'}
                  alt={item.product?.name}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                />
                <div style={{ flex: 1 }}>
                  <div>{item.product?.name || 'Product'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </div>
                </div>
                <strong>${(item.quantity * item.price).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderHistoryPage() {
  return <ProtectedRoute><OrderHistory /></ProtectedRoute>;
}
