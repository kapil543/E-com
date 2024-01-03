import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "./user.model.js";
import Jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
 
export class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel(name, email, hashedPassword, type);
      console.log(user);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong in controller", 500);

    }
  }
  async signIn(req, res, next) {
    try {
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          //1.create token.
          const token = Jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          //2. send token.

          return res.send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send("something went wrong");
    }
  }
  async resetPassword(req,res,next){
     const {newPassword}=req.body;
     const hashedPassword= await bcrypt.hash(newPassword,10);
     const userID=req.userID;
     try {
      await this.userRepository.resetPassword(userID,hashedPassword);
      res.status(200).send("password is updated");
     } catch (error) {
      console.log(error);
      console.log("passing err to middleware");
      next(error);
     }
  }
}
