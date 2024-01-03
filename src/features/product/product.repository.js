import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";
const ProductModel=mongoose.model("Product",productSchema);
const ReviewModel=mongoose.model("Review",reviewSchema); 
const CategoryModel=mongoose.model("Category",categorySchema);
class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(productData) {
    try {
      productData.categories=productData.categories.split(",");
      console.log(productData);
      const newProduct=new ProductModel(productData);
      const savedProduct=await newProduct.save();
      // update category
      await CategoryModel.updateMany(
        {_id:{$in:productData.categories}},
        {$push:{products:new ObjectId(savedProduct._id)}}
      )
      // const db = getDB();
      // const collection = db.collection(this.collection);
      // await collection.insertOne(newProduct);
      // console.log("ne", newProduct);
      // return newProduct;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.find().toArray();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.findOne({ _id: new ObjectId(id) });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
  async filter(minPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = {
          $gte: parseFloat(minPrice),
        };
      }
      // if (maxPrice) {
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      // }
      console.log(category);
      category=JSON.parse(category.replace(/'/g,'"'));
      console.log(category);
      if (category) {
        filterExpression={$and:[{category :{$in:category}},filterExpression]}
      }
      return collection.find(filterExpression).project({name:1,price:1,_id:0,ratings:{$slice:-1}}).toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
  // async rate(userID, productID, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     const product=await collection.findOne({_id:new ObjectId(productID)});
  //     const userRating=product?.ratings?.find(r=>r.userID==userID); 
  //     if(userRating){
  //       await collection.updateOne({
  //         _id:new ObjectId(productID),"ratings.userID":new ObjectId(userID)
  //       },{
  //         $set:{
  //           "ratings.$.rating":rating 
  //         }
  //       })
  //     }else{
        
  //     collection.updateOne(
  //       { _id: new ObjectId(productID) },
  //       {
  //         $push: { ratings: { userID:new ObjectId(userID), rating } },
  //       }
  //     );
  //     }
       
  //   } catch (error) {
  //     console.log(error);
  //     throw new ApplicationError("something went wrong", 500);
  //   }
  // }
  async rate(userID, productID, rating) {
    try {
      // 1.check if product exist
      const productToUpdate=await ProductModel.findById(productID);
      if(!productToUpdate){
        throw new Error("product not found");
      }
      // find the existing review
      const userReview= await ReviewModel.findOne({product:new ObjectId(productID),user:new ObjectId(userID)});
      if(userReview){
        userReview.rating=rating;
        console.log("use",userReview);
        await userReview.save();
      }else{
        const newReview=await new ReviewModel({
          product:new ObjectId(productID),
          user:new ObjectId(userID),
          rating:rating
        });
        console.log(newReview);
        newReview.save();
      }
      // const db = getDB();
      // const collection = db.collection(this.collection);
    
      // await collection.updateOne(
      //   { _id: new ObjectId(productID) },
      //   {
      //     $pull: { ratings: { userID:new ObjectId(userID)} },
      //   }
      // );

      // await collection.updateOne(
      //   { _id: new ObjectId(productID) },
      //   {
      //     $push: { ratings: { userID:new ObjectId(userID), rating } },
      //   }
      // );
       
       
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
  async averageProductPriceCategory(){
    try {
      const db=getDB();
     return await db.collection(this.collection)
      .aggregate([{
        $group:{
          _id:"$category",
          averagePrice:{$avg:"$price"}
        }
    }]).toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
}
export default ProductRepository;
