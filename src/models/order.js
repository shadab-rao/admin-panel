 const mongoose = require('mongoose');

 const orderSchema = new mongoose.Schema({
     user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'UserModel'
     },
     products: [
         {
             product: {
                 type: mongoose.Schema.Types.ObjectId,
                 required: true,
                 ref: 'ProductModel'
             },
             quantity: {
                 type: Number,
                 required: true
             }
         }
     ],
     totalPrice: {
         type: Number,
         required: true
     },
     status: {
         type: String,
         enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
         default: 'pending'
     }
 }, { timestamps: true });

 module.exports = mongoose.model('OrderModel', orderSchema);