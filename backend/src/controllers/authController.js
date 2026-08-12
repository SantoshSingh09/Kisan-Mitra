const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByPhone } = require('../models/User');
require('dotenv').config();

function signup(req, res) {
  const { name, phone, password, region } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'Name, phone and password are required' });
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });
    createUser(name, phone, hashedPassword, region, (err, userId) => {
      if (err) return res.status(400).json({ message: 'This phone number is already registered' });
      res.status(201).json({ message: 'Signup successful', userId });
    });
  });
}

function login(req, res) {
  const { phone, password } = req.body;
  findUserByPhone(phone, (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'User not found' });
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name } });
    });
  });
}

module.exports = { signup, login };