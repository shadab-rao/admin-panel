const { default: mongoose } = require("mongoose");
const categoryModel = require("../models/categoryModel");

const categoryCreate = async (req, res) => {
  const { name, status } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const exist = await categoryModel.findOne({ name, user: req.user.id });
    if (exist) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    const category = await categoryModel.create({
      name,
      status,
      user: req.user.id,
    });

    res.status(201).json({
      msg: "Category created successfully",
      category: {
        name: category.name,
        status: category.status,
      },
      user: req.user.id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: "productmodels",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          products: {
            $size: "$products",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res.status(201).json({
      success: true,
      msg: "Categories fetch successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const changeStatusCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }
    category.status = !category.status;
    await category.save();
    res.json({ success: true, msg: "Status updated successfully", category });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { categoryCreate, getCategory, changeStatusCategory };
