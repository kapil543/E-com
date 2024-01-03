import express from "express";
import OrderController from "./order.controller.js";
const orderRouter = express.Router();
const ordercontroller=new OrderController();
orderRouter.post("/", (req, res ,next) => {
  console.log("check");
  ordercontroller.placeOrder(req, res, next);
});
 
 
//localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1

export default orderRouter;
