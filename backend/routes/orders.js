const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../data/database.json');

// Helper function to read database
const readDb = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Helper function to write to database
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Create order
router.post('/', (req, res) => {
  const { userId, items, shippingInfo, total } = req.body;
  const db = readDb();
  
  // Validate user exists
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Create new order
  const newOrder = {
    id: uuidv4(),
    userId,
    items,
    shippingInfo,
    total,
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  
  db.orders.push(newOrder);
  writeDb(db);
  
  res.status(201).json({ 
    message: 'Order created successfully',
    order: newOrder
  });
});

// Get user orders
router.get('/user/:userId', (req, res) => {
  const db = readDb();
  const userOrders = db.orders.filter(order => order.userId === req.params.userId);
  
  res.json(userOrders);
});

module.exports = router;