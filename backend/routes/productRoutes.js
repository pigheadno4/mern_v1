import express from "express";
const router = express.Router();
// import products from "../data/products.js";
// import asyncHandler from "../middleware/asyncHandler.js";
// import Product from "../models/productModel.js";
import {
  getProducts,
  getProductsbyId,
} from "../controllers/productController.js";

router.route("/").get(getProducts);
router.route("/:id").get(getProductsbyId);

// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const products = await Product.find({});

//     res.json(products);
//   })
// );

// router.get(
//   "/:id",
//   asyncHandler(async (req, res) => {
//     // const product = products.find((p) => p._id === Number(req.params.id));
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       return res.json(product);
//     } else {
//       res.status(404);
//       throw new Error("Resource not found");
//       // res.status(404).json({ message: "Product not found" });
//     }
//   })
// );

export default router;
