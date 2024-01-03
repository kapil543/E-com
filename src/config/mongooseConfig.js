import mongoose from "mongoose";
import "../../env.js";
import { categorySchema } from "../features/product/category.schema.js";
export const connectUsingMongoose = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db  connected using  mongoose");
    addCategories();
  } catch (error) {
    console.log("err connecting mongoose");
    console.log(error);
  }
};
async function addCategories() {
  const CategoryModel = mongoose.model("Category", categorySchema);
  const categories = CategoryModel.find();
  if (!categories || (await categories).length == 0) {
    const resp=await CategoryModel.insertMany([
      { name: "Books" },
      { name: "Clothing" },
      { name: "Electronics" },
    ]);
    console.log(resp);
  }
  console.log("category added");
}
