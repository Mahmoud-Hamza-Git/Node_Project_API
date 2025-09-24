const express = require('express');
const { protect } = require('../middlewares/auth');
const { uploadSingleImage } = require('../middlewares/upload');
const path = require('path');

const router = express.Router();

// Upload a single image with field name 'photo'
router.post('/image', protect, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ filename: req.file.filename, url });
  });
});

module.exports = router;
