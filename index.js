const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectDB();




app.use("/auth", require("./src/routes/authRoute"));
app.use("/category", require("./src/routes/categoryRoute"));
app.use("/product", require("./src/routes/productRoutes"));
app.use("/order", require("./src/routes/orderRoutes"));
app.use("/cart", require("./src/routes/cartRoutes"));
app.use("/reset", require("./src/routes/resetPassRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
