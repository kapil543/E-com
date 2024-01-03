import mongoose, { Model } from "mongoose";

 export const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'on_model'
    },
    on_model:{
        type:String,
        emum:["Product","Category"]
    }
}).pre('save',(next)=>{
    console.log("newlike is comming in");
    next();
}).post('save',(doc)=>{
    console.log("like is saved");
    console.log(doc);
}).pre('find',(next)=>{
    console.log("retriveing like");
    next();
}).post('find',(doc)=>{
    console.log("after post find");
    console.log(doc);
    
})