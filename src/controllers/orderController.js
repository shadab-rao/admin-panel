const { default: mongoose } = require("mongoose");
const order = require("../models/order");
const productModel = require("../models/productModel");



const addOrder = async (req, res) => {
  const { products, status } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ msg: "Products are required" });
  }

  try {
    let totalPrice = 0;

    for (let item of products) {
      const product = await productModel.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ msg: `Product not found: ${item.product}` });
      }
      totalPrice += product.price * item.quantity;
    }

 
    const response = await order.create({
      products,
      totalPrice,
      user: req.user.id,
      status: status || "pending",
    });

    res.status(201).json({ 
      success: true, 
      msg: "Order created successfully", 
      order: response 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id)} },
      {
        $lookup: {
          from: "productmodels",
          localField: "products.product",
          foreignField: "_id",
          as: "products",
          pipeline: [
            { $project : {_id:1,name:1,price:1,description:1}}
          ]
        },
      },
      { $project: { _id: 1, products: 1, totalPrice: 1, status: 1 } },
    ]);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addOrder, getOrders };
