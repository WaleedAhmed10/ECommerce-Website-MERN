import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { ProductCard, LoadingSpinner, ErrorMessage } from '../components/SharedComponents';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Footwear', 'Books', 'Kitchen', 'Sports', 'Home'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();

  const searchParam = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (searchParam) params.search = searchParam;
        if (activeCategory !== 'All') params.category = activeCategory;
        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch {
        setError('Failed to load products. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [searchParam, activeCategory]);

  return (
    <div className="container">
      {searchParam && (
        <h2 style={{ marginTop: 16 }}>
          Search results for: <em>"{searchParam}"</em>
        </h2>
      )}

      <div className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          No products found.
        </div>
      )}
      {!loading && !error && (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
