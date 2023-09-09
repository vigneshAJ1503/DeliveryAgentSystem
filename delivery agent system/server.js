// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data structure to store orders
let orders = [];

// Function to set order status as "Pending in process of delivery"
function setOrderPending(order) {
  order.status = 'Pending in process of delivery';
}

// Function to set order status as "Order delivered"
function setOrderDelivered(order) {
  order.status = 'Order delivered';
}

// Function to update the delivery status of orders
function updateDeliveryStatus() {
  const currentTime = new Date();

  for (const order of orders) {
    const deliveryTime = new Date(order.deliveryTime);
    if (currentTime >= deliveryTime && order.status !== 'Order delivered') {
      setOrderDelivered(order);
    }
  }
}

// API route to get all orders
app.get('/api/orders', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to create a new order
app.post('/api/orders', (req, res) => {
  const { customerName, fromAddress, deliveryDate, toAddress, deliveryTime } = req.body;

  try {
    const newOrder = {
      id: orders.length + 1, // You can use a more robust ID generation method in a production environment
      customerName,
      fromAddress,
      deliveryDate,
      toAddress,
      deliveryTime,
      status: 'Pending',
    };

    setOrderPending(newOrder);

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set interval to check and update delivery status every minute
setInterval(updateDeliveryStatus, 60000); // 60000 ms = 1 minute

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
