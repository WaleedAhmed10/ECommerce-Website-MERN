import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useState } from 'react';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePlaceOrder = async () => {
    if (!user) return navigate('/login');
    setPlacing(true);
    setError('');
    try {
      const items = cart.map((i) => ({ product: i.product._id, quantity: i.quantity }));
      await api.post('/orders', { items });
      clearCart();
      setSuccess('Order placed successfully! 🎉');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 60 }}>
        {success ? (
          <div className="alert alert-success">{success}</div>
        ) : (
          <>
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <h2 style={{ margin: '16px 0 8px' }}>Your cart is empty</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>Add items to get started</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Shop Now</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ margin: '20px 0 16px' }}>Shopping Cart ({cart.length} items)</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {cart.map((item) => (
        <div key={item.product._id} className="cart-item">
          <img
            src={item.product.imageUrl || 'https://via.placeholder.com/80'}
            alt={item.product.name}
          />
          <div className="cart-item-info">
            <h4>{item.product.name}</h4>
            <div className="product-price">${item.product.price.toFixed(2)}</div>
          </div>
          <div className="qty-control">
            <button onClick={() => updateQty(item.product._id, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQty(item.product._id, item.quantity + 1)}>+</button>
          </div>
          <div style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.product._id)}>
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Subtotal: ${cartTotal.toFixed(2)}</h3>
        <button
          className="btn btn-primary"
          style={{ minWidth: 200 }}
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
