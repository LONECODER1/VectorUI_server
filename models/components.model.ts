import mongoose from "mongoose";
import { IComponent } from "./types.js";


const componentSchema = new mongoose.Schema<IComponent>({
  name: String,

  code: String,

  props: [String],   // customizable props

  variations: [{
    name: String,
    options: [mongoose.Schema.Types.Mixed]
  }],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  visibility: {
    type: String,
    enum: ["private", "public"],
    default: "private"
  },

  npmPackage: String

}, { timestamps: true });

const Component = mongoose.model<IComponent>("Component", componentSchema);

export default Component;