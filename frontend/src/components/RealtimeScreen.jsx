import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/RealtimeScreen.css';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

function RealtimeScreen() {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchOrders();
    
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('newOrder', (order) => {
      console.log('New order received:', order);
      setOrders(prevOrders => [order, ...prevOrders]);
      
      // Show notification animation
      playNotificationSound();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const playNotificationSound = () => {
    // Visual notification (can add sound if needed)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZijcIGGS57OipUBELTKXh8bllHAU2jdXvz3gqBSh+zPLaizsIFGS56+qnVBMKTKPg8bdlHAQ3jdTvz3gqBSh+zPLaizsIFGS56+qnVBMKTKPg8bdlHAQ3jdTvz3gqBSh+zPLaizsIFGS56+qnVBMKTKPg8bdlHAQ3jdTvz3gqBSh+zPLaizsIFGS56+qnVBMK');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="realtime-container">
      <div className="realtime-header">
        <h1>Realtime Orders</h1>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Live</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet</p>
          <p className="subtitle">Orders will appear here in realtime</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="order-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="order-header">
                <h3>{order.orderId}</h3>
                <span className="order-time">{formatDateTime(order.createdAt)}</span>
              </div>
              
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total Amount:</span>
                <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RealtimeScreen;