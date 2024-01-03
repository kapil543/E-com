import mongoose, { model } from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

const LikeModel=mongoose.model("Like",likeSchema)
export class LikeRepository{
     async likeProduct(userId,productId){
        try {
            console.log("likeProduct");
            const newLike = await new LikeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(productId),
                on_model:"Product"
            });
            console.log(newLike);
            newLike.save();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong like  Repository", 500);
          }
     }
     async likeCategory(userId,categoryId){
        try {
            const newLike =await new LikeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(categoryId),
                on_model:"Category"
            })
            newLike.save();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong like  Repository", 500);
          }
     }
     async getLikes(type,id){
        return await LikeModel.find({
            likeable:new ObjectId(id),
            on_model:type
        }).populate("user").populate({path:"likeable",model:type});
     }
}