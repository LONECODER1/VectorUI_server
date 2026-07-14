import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const componentSchema = new mongoose.Schema({}, { strict: false });
const Component = mongoose.model("Component", componentSchema, "components");

async function checkComponents() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const count = await Component.countDocuments();
    const components = await Component.find().limit(5).lean();
    console.log(`Total components in DB: ${count}`);
    console.log("Latest components:", JSON.stringify(components, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkComponents();
