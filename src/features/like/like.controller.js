import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res) {
    try {
      const { id, type } = req.body;
      if (type != "Product" && type != "Category") {
        return res.status(400).send("Invalid");
      }
      if (type == "Product") {
        await this.likeRepository.likeProduct(req.userID, id);
      } else {
        await this.likeRepository.likeCategory(req.userID, id);
      }
      return res.status(201).send();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);
    }
  }
  async getLikes(req,res){
    try {
        const {id,type}=req.query;
        const likes=await this.likeRepository.getLikes(type,id);
        return res.status(200).send(likes);
    } catch (error) {
        console.log(error);
        throw new ApplicationError("something went wrong in controller", 500);
    }
  }
}
