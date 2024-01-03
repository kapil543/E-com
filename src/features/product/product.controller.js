import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);
    }
  }
  async addProduct(req, res) {
    try {
      console.log(req.body);
      const { name, price, sizes,categories } = req.body;
      const newProduct = new ProductModel(
        name,
        null,
        parseFloat(price),
        req.file.filename,
        categories,
        sizes.split(",")
        
      );

      const createdRecord = await this.productRepository.add(newProduct);
      console.log(createdRecord);

      res.status(201).send(createdRecord);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);
    }
  }
  async rateProduct(req, res, next) {
    try {
      const userID = req.userID;
      const productID = req.body.productID;
      const rating = req.body.rating;

      const result = await this.productRepository.rate(
        userID,
        productID,
        rating
      );
      return res.status(200).send("rating heppened");
    } catch (err) {
      console.log("passing error to middleware");
      next(err);
    }
  }
  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);
    }
  }
  async filterProducts(req, res) {
    try {
      console.log("filter");

      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = await this.productRepository.filter(
        minPrice,
       
        category
      );
      console.log(result, req.query), res.status(200).send(result);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);
    }
  }
  async averagePrice(req,res,next){
    try{
      const result=await this.productRepository.averageProductPriceCategory();
        res.status(200).send(result);
    }catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);
    }
  }
}
