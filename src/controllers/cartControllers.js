const { default: mongoose } = require("mongoose");
const cartModel = require("../models/cartModel");

const addToCart = async (req, res) => {
  let { productId, quantity } = req.body;

  try {
    productId = new mongoose.Types.ObjectId(productId);
    let cart = await cartModel.findOne({ user: req.user.id });

    const qty = Number(quantity) || 1;

    if (!cart) {
      cart = new cartModel({
        user: req.user.id,
        items: [{ product: productId, quantity: qty || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({ product: productId, quantity: qty });
      }
    }

    await cart.save();
    res.json({ success: true, msg: "Item added successfully", cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cartData = await cartModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "productmodels",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          createdAt: { $first: "$createdAt" },
          updated: { $first: "$updatedAt" },
          totalPrice: {
            $sum: { $multiply: ["$items.quantity", "$productDetails.price"] },
          },
          items: {
            $push: {
              product: "$items.product",
              quantity: "$items.quantity",
              productDetails: "$productDetails",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          user: 1,
          createdAt: 1,
          updatedAt: 1,
          totalPrice: 1,
          items: {
            product: 1,
            quantity: 1,
            productDetails: {
              _id: 1,
              name: 1,
              price: 1,
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      msg: "Cart fetched successfully",
      cart: cartData[0] || { items: [] },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { addToCart, getCart };
