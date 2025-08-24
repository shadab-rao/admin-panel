const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addToCart, getCart, updateCart, deleteCartItem } = require("../controllers/cartControllers");
const router = express.Router();

router.post("/add",authMiddleware,addToCart);
router.get("/get",authMiddleware,getCart);
router.put("/update",authMiddleware,updateCart);
router.delete("/delete/:id",authMiddleware,deleteCartItem);

module.exports=router

