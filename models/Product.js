const mongoose = require('mongoose');
 
 const productSchema = new mongoose.Schema(
   {
     name: { type: String, required: true, trim: true },
     description: { type: String, trim: true },
     photo: { type: String, trim: true },
     price: { type: Number, required: true, min: 0 },
     seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   },
   { timestamps: true }
 );
 
 productSchema.index({ name: 'text' });
 
 module.exports = mongoose.model('Product', productSchema);
