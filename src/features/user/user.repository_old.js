import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
class UserRepository {
  constructor(){
    this.collection='users';
 }
  async signUp(newUser) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      console.log(newUser);

      await collection.insertOne(newUser);
      console.log("ne", newUser);
      return newUser;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
  async findByEmail(email ) {
    try {
      const db = getDB();

      const collection = db.collection("users");

    //   console.log(newUser);

      return await collection.findOne({email});
    //   console.log("ne", newUser);
      
    } catch (error) {
      console.log(error);
      throw new ApplicationError("something went wrong", 500);
    }
  }
}
export default UserRepository;
