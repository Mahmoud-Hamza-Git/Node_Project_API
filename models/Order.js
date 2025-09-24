const mongoose = require('mongoose');
 
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    status: { type: String, enum: ['pending', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
