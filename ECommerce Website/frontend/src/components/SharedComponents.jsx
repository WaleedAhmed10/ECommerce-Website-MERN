import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function StarRating({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars">
      {'★'.repeat(full)}{'☆'.repeat(5 - full)} ({rating.toFixed(1)})
    </span>
  );
}

export function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <img
        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name}
      />
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <StarRating rating={product.rating} />
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#1e8449' : '#c0392b', marginTop: 4 }}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}

export function ErrorMessage({ message }) {
  return <div className="alert alert-error">{message}</div>;
}

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }
  if (adminOnly && user.role !== 'admin') {
    setTimeout(() => navigate('/'), 0);
    return null;
  }
  return children;
}
