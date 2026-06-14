import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { StarRating, LoadingSpinner, ErrorMessage } from '../components/SharedComponents';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  return (
    <div className="container">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
        ← Back
      </button>
      <div className="product-detail">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
        />
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} />
          <div className="product-price">${product.price.toFixed(2)}</div>

          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? `✔ In Stock (${product.stock} available)` : '✖ Out of Stock'}
          </span>

          <p style={{ color: '#555', lineHeight: 1.6, margin: '12px 0' }}>{product.description}</p>
          <p style={{ fontSize: '0.88rem', color: '#888', marginBottom: 8 }}>
            Category: <strong>{product.category}</strong>
          </p>

          {product.stock > 0 && (
            <>
              <div className="qty-control">
                <span style={{ fontWeight: 600 }}>Qty:</span>
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAdd}>
                {added ? '✔ Added to Cart!' : '🛒 Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
