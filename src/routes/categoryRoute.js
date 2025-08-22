const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { categoryCreate, getCategory, changeStatusCategory } = require("../controllers/categoryController");
const router = express.Router();

router.post("/add",authMiddleware,categoryCreate);
router.get("/getAll",authMiddleware,getCategory);
router.patch("/change-status/:id",authMiddleware, changeStatusCategory);

module.exports=router

