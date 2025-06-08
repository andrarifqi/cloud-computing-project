const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

// Helper function to read database
const readDb = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Get all products
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.products);
});

// Get single product
router.get('/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

module.exports = router;