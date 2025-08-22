const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addOrder, getOrders } = require("../controllers/orderController");
const router = express.Router();

router.post("/add",authMiddleware,addOrder);
router.get("/get-order",authMiddleware,getOrders);

module.exports=router

