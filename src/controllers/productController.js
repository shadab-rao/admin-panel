const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");

const createProduct = async (req, res) => {
  const { name, price, description, category } = req.body;

  if (!name || !price || !description || !category) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const product = await productModel.create({
      name,
      price,
      description,
      user: req.user.id,
      category,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const allProducts = async (req, res) => {
  try {
    // const products = await productModel
    //   .find({ user: req.user.id })
    //   .sort({ createdAt: -1 })
    //   .populate("category", "name");

    const pro = await productModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $sort: { updatedAt: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "categorymodels",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [{ $project: { _id: 1, name: 1 } }],
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          category: { _id: 1, name: 1 },
        },
      },
    ]);

    res.json({ success: true, pro });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category } = req.body;

  try {
    const response = await productModel.findByIdAndUpdate(
      id,
      { name, price, description, category, user: req.user.id },
      { new: true }
    );
    if (!response) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ success: true, product: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const viewProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel
      .findById(id)
      .populate("category", "name");
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createProduct, allProducts, updateProduct, viewProduct };
