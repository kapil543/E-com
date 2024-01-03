import express from "express";
import { LikeController } from "./like.controller.js";
const likeRouter = express.Router();
const likecontroller=new LikeController();
likeRouter.post("/", (req, res ,next) => {
  console.log("check like");
  likecontroller.likeItem(req, res, next);
});
likeRouter.get("/", (req, res ,next) => {
    console.log("check like");
    likecontroller.getLikes(req, res, next);
  });
 
//localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1

export default likeRouter;
