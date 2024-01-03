import "./env.js";
import express from "express";
import cors from "cors";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";
import bodyParser from "body-parser";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import likeRouter from "./src/features/like/like.routes.js";
const server = express();

server.use(bodyParser.json());
server.use(loggerMiddleware);
var corsOptions = {
  origin: "http://localhost:5500",
  allowedHeaders: "*",
};
server.use(cors());
// server.use((req,res,next)=>{
//   res.header('Access-Control-Allow-Origin','http://localhost:5500');
//   res.header('Access-Control-Allow-Headers','*');
//   res.header('Access-Control-Allow-Methods','*')
//   //return ok for preflight req
//   if(req.method="OPTIONS"){
//     return res.sendStatus(200);
//   }
//   next();
// });
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/likes", jwtAuth, likeRouter);
server.use("/api/users", userRouter);
server.use("/api/cartItems", loggerMiddleware, jwtAuth, cartRouter);
server.use((err, req, res, next) => {
  console.log(err);
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  res.status(500).send("something  went wrong ,please try later");
});
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found.please check our documentation for more information at http://localhost:3200/api-docs"
    );
});

server.listen(3200, () => {
  console.log("server is running  http://localhost:3200/");
  // connectToMongoDB();
  connectUsingMongoose();
});
