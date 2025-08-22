const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addToCart, getCart } = require("../controllers/cartControllers");
const router = express.Router();

router.post("/add",authMiddleware,addToCart);
router.get("/get",authMiddleware,getCart);

module.exports=router

