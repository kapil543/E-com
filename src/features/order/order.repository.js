import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository{
    constructor(){
        this.collection="orders";
    }
    async placeOrder(userId){
        const client=getClient();
        const session=client.startSession();
        try {
             
            //          1. get cart item of user and calculate total amount
            const db=getDB();
            session.startTransaction();
            console.log(userId);
            const items=await this.getTotalAmount(userId,session);
            const totalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0);
            console.log(totalAmount);
            console.log(items);
//          2.create a record for order
            const newOrder=new OrderModel(new ObjectId(userId),totalAmount,new Date());
            db.collection(this.collection).insertOne(newOrder,{session});
//          3.Reduce the stock (product quantity)
            for(let item of items){
                await db.collection("products").updateOne(
                    {_id:item.productID },
                    {$inc:{stock:-item.quantity}},{session}
                )
            }
            throw new Error("someting went wrong in placeorder")
//          4.clear the cart
            await db.collection("cartItems").deleteMany({
                userID:new ObjectId(userId)
            },{session});
            session.commitTransaction();
            session.endSession();
            return ;
        } catch (error) {
            await session.abortTransaction(); 
            session.endSession();
            console.log(error);
            throw new ApplicationError("something went wrong in  repo", 500);
        }
 
    }
    async getTotalAmount(userId,session){
        const db=getDB();
        const items=await db.collection("cartItems").aggregate([
            //get cart items for user
            {
                    $match:{userID:new ObjectId(userId)}
            },
            //2.get the product from product collection.
            {
                $lookup:{
                    from:"products",
                    localField:"productID",
                    foreignField:"_id",
                    as:"productInfo"
                }
            },
            //3.unwind the productInfo
            {
                $unwind:"$productInfo"
            },
            //4.calculate totalAmount for each cartItems.
            {
                $addFields:{
                    "totalAmount":{
                        $multiply:["$productInfo.price","$quantity"]
                    }
                }
            }
        ],{session}).toArray();
        return items;
        
    }
}