const bcrypt = require('bcrypt');
const { getUserById, updateProfile, updatePassword, getPasswordHash } = require('../models/UserProfile');

function getProfile(req, res) {
  getUserById(req.userId, (err, user) => {
    if (err) return res.status(500).json({ message: 'Error fetching profile' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  });
}

function editProfile(req, res) {
  const { name, region } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  updateProfile(req.userId, name, region, (err) => {
    if (err) return res.status(500).json({ message: 'Error updating profile' });
    res.json({ message: 'Profile updated successfully' });
  });
}

function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are both required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  getPasswordHash(req.userId, (err, hash) => {
    if (err || !hash) return res.status(500).json({ message: 'Error verifying current password' });

    bcrypt.compare(currentPassword, hash, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

      bcrypt.hash(newPassword, 10, (err, newHash) => {
        if (err) return res.status(500).json({ message: 'Error hashing new password' });
        updatePassword(req.userId, newHash, (err) => {
          if (err) return res.status(500).json({ message: 'Error updating password' });
          res.json({ message: 'Password changed successfully' });
        });
      });
    });
  });
}

module.exports = { getProfile, editProfile, changePassword };