import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const componentSchema = new mongoose.Schema({}, { strict: false });
const Component = mongoose.model("Component", componentSchema, "components");
async function transferComponents() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        // Transfer from codecommander... to adityagupta...
        const result = await Component.updateMany({ owner: "6a536b66be09243469ee6b2b" }, { $set: { owner: "6a544d5bb38e823c627c35e4" } });
        console.log(`Transferred ${result.modifiedCount} components.`);
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
transferComponents();
