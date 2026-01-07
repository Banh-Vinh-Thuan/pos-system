## 📦 POS System – Milk Tea Shop

A simple Point of Sale (POS) system for a milk tea shop with real-time order display.  
The system allows users to create orders on the POS screen and view orders instantly on a separate realtime screen without page reload.

---

## 🚀 Features

### Backend (Node.js + Express + Socket.io)
- REST API to fetch product list
- API to create orders
- API to get order list
- Real-time communication using Socket.io
- In-memory data storage
- Seed data with 8 drink products

### Frontend (React)
- POS Screen: display products, cart, and payment
- Realtime Screen: display orders in real time
- Responsive UI
- Routing using React Router
- Modular component structure with separate CSS files

---

## 🏗 Project Structure

```text
pos-system/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── .gitignore
```
node_modules is ignored and must be installed manually.

## ⚙️ How to Run

```bash
1️⃣ Backend
cd backend -> npm install -> npm start

2️⃣ Frontend
cd frontend -> npm install -> npm start
```

## 🔄 Realtime Flow

```bash
When a user completes a payment on the POS Screen
The frontend sends a request to the backend to create a new order
Backend emits a Socket.io event
Realtime Screen receives the event and updates instantly
```

## 📌 Notes

```bash
This project uses in-memory storage (data will reset when the server restarts)
No payment gateway is integrated (payment is simulated)
Product management is not included as per requirements
```

## 📚 Tech Stack

```bash
Frontend: React, React Router
Backend: Node.js, Express
Realtime: Socket.io
```
