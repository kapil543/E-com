import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";
const productRouter = express.Router();
const productController = new ProductController();
productRouter.post("/rate", (req, res ,next) => {
  console.log("check");
  productController.rateProduct(req, res, next);
});
productRouter.get("/filter", (req, res) => {
  console.log("check");
  productController.filterProducts(req, res);
});
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  console.log("check");
  productController.addProduct(req, res);
});
productRouter.get("/averagePrice", (req, res,next) => {
  productController.averagePrice(req, res);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});
 
//localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1

export default productRouter;
