import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
const UserModel = mongoose.model("User", userSchema);
export default class UserRepository {
  async signUp(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
    } catch (error) {
        if(error instanceof mongoose.Error.ValidationError){
            throw error;
        }else{
            console.log(error);
      throw new ApplicationError("something went wrong with database", 500);
        }
       
    }
  }
  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }
  async resetPassword(userID, hashedPassword) {
    try {
      let user = await UserModel.findById(userID);
      if (user) {
        user.password = hashedPassword;
        user.save();
      } else {
        throw new ApplicationError("user not found", 300);
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }
}
