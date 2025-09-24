 require('dotenv').config();
 const express = require('express');
 const cors = require('cors');
 const mongoose = require('mongoose');
 const path = require('path');
 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middlewares/error');
 
const app = express();
 
// Middlewares
app.use(cors());
app.use(express.json());
  // Static uploads
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // Health check
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Ecommerce API is running' });
  });
  // DB Connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seller/products', sellerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
 
 // Not Found
 app.use((req, res, next) => {
   res.status(404).json({ message: 'Not Found' });
 });
 // Error handler
 app.use(errorHandler);
 
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
