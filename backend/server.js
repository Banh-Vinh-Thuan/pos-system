const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage
let orders = [];
let orderIdCounter = 1;

// Seed data - Product list
const products = [
  { id: 1, name: "Milk Tea", price: 45000, image: "Trasua.png" },
  { id: 2, name: "Black Tea", price: 35000, image: "Hongtra.png" },
  { id: 3, name: "Matcha Latte", price: 40000, image: "Matcha.png" },
  { id: 4, name: "Lychee Tea", price: 50000, image: "Travai.png" },
  { id: 5, name: "Lemon Tea", price: 38000, image: "Trachanh.png" },
  { id: 6, name: "Blueberry Yakult", price: 55000, image: "Blueberry Yakult.png" },
  { id: 7, name: "Oolong Tea", price: 55000, image: "Bonmua.png" },
  { id: 8, name: "Taro Milk Tea", price: 50000, image: "Khoaimon.png" }
];

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API: Get all products
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});

// API: Create order
app.post('/api/orders', (req, res) => {
  const { items, totalAmount } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Cart is empty' 
    });
  }

  const newOrder = {
    id: orderIdCounter++,
    orderId: `ORD${String(orderIdCounter).padStart(5, '0')}`,
    items,
    totalAmount,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  
  // Emit new order to all connected clients
  io.emit('newOrder', newOrder);
  
  res.json({ 
    success: true, 
    message: 'Payment successful',
    data: newOrder 
  });
});

// API: Get all orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});