import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/POSScreen.css';

const API_URL = 'http://localhost:5000/api';

function POSScreen() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Failed to load products');
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('Cart is empty!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/orders`, {
        items: cart,
        totalAmount: getTotalAmount()
      });

      if (response.data.success) {
        setMessage('✓ Payment successful!');
        setCart([]);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('Payment failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="pos-container">
      <h1 className="pos-title">POS System</h1>
      
      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="pos-content">
        <div className="products-section">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={`/images/${product.image}`} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-weight:bold;">${product.image}</div>`;
                    }}
                  />
                </div>
                <h3>{product.name}</h3>
                <p className="price">{formatCurrency(product.price)}</p>
                <button 
                  className="btn-add"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h2>Cart</h2>
          
          {cart.length === 0 ? (
            <p className="empty-cart">Cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{formatCurrency(item.price)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button 
                        className="btn-qty"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="btn-qty"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button 
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="cart-item-total">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="total">
                  <span>Total:</span>
                  <span className="total-amount">{formatCurrency(getTotalAmount())}</span>
                </div>
                <button 
                  className="btn-checkout"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default POSScreen;