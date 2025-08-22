const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createProduct, allProducts, updateProduct, viewProduct } = require("../controllers/productController");
const router = express.Router();

router.post("/add",authMiddleware,createProduct);
router.get("/getAll",authMiddleware,allProducts);
router.put("/edit/:id",authMiddleware,updateProduct);
router.get("/view/:id",authMiddleware,viewProduct);

module.exports=router