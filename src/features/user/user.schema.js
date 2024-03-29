import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name can't be greater then 25 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "please enter a valid email"],
  },
  password: {
    type: String,
    // validate: {
    //   validator: function (value) {
    //     return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
    //   },
    //   message:
    //     "password should be between 8-12 characters and have a spacial charactor ",
    // },
  },
  type: { type: String, enum: ["Customer", "Seller"] },
});
