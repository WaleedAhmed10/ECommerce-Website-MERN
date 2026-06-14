import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { ProtectedRoute } from '../components/SharedComponents';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Books', 'Kitchen', 'Sports', 'Home', 'Other'];

const empty = { name: '', description: '', price: '', category: 'Electronics', imageUrl: '', stock: '', rating: '' };

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          imageUrl: data.imageUrl || '',
          stock: data.stock,
          rating: data.rating
        });
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.price || !form.category)
      return setError('Name, description, price, and category are required');

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 0
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 540 }}>
      <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Apple AirPods Pro" />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." />
        </div>
        <div className="form-group">
          <label>Price ($) *</label>
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Rating (0–5)</label>
            <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="0.0" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button className="btn btn-primary form-btn" type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminProductPage() {
  return <ProtectedRoute adminOnly><ProductForm /></ProtectedRoute>;
}
