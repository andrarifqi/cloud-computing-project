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

// Register endpoint
router.post('/register', (req, res) => {
  const { fullname, email, password } = req.body;
  const db = readDb();
  
  // Check if user already exists
  const userExists = db.users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    fullname,
    email,
    password, // In a real app, you would hash the password
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  writeDb(db);
  
  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  
  const user = db.users.find(user => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // In a real app, you would generate a JWT token here
  res.json({ 
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      fullname: user.fullname
    }
  });
});

// Add to your existing auth routes
router.post('/logout', (req, res) => {
    // In a real app, you would:
    // 1. Invalidate the token if using JWT
    // 2. Clear server-side session if using sessions
    // 3. Perform any other cleanup
    
    res.json({ message: 'Logout successful' });
});

module.exports = router;