import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null, 
    },
    properties: [
      {
        type: Object,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
