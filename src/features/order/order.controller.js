import OrderRepository from "./order.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderController{
    constructor(){
        this.orderRepository=new OrderRepository()
    }
    async placeOrder(req,res,next){
        try {
            const userId=req.userID;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("order is created");
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong in controller", 500);
        }
    }
}