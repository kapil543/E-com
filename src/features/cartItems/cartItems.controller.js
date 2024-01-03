import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";
export default class CartItemsController{
    constructor(){
        this.cartItemsRepository=new CartItemsRepository();
    }
    async add(req,res){
        try {
            const {productID,quantity}=req.body;
            const userID=req.userID;
            await this.cartItemsRepository.add(productID,userID,quantity);
            res.status(201).send("cart is updated");
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong in controller", 500);
        }
        
    }
    async get(req,res){
        
        try {
            const userID=req.userID;
            const items=await this.cartItemsRepository.get(userID);
            return res.status(200).send(items);
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong in controller", 500);
        }
    }
    async delete(req,res){
      
        try {
            const userID=req.userID;
            const cartItemID=req.params.id;
           const isDeleted=await this.cartItemsRepository.delete( userID,cartItemID)
            if(!isDeleted){
                return res.status(404).send("cort item not found");
            }
            return res.status(200).send('Cart Item is removed');
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong in controller", 500);
        }
    }
}