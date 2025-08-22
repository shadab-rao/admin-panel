const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status:{type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, user: 1 }, { unique: true });


module.exports = mongoose.model("CategoryModel", categorySchema);
