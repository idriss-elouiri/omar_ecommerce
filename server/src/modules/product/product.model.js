import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // Make userId required to ensure every product is linked to a user
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Trim whitespace from the title
    },
    briefDesc: {
      type: String,
      trim: true, // Trim whitespace from briefDesc
    },
    images: {
      type: [String], // Specify the type of array elements
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true, // Ensure every product has a category
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure the price is non-negative
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Trim whitespace from the slug
    },
    properties: {
      type: Object,
      default: {}, // Set a default empty object for properties
    },
  },
  { timestamps: true }
);

// Optional: Add a pre-save hook to generate the slug automatically from the title if not provided
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-') // Replace non-alphanumeric characters with a dash
      .replace(/-+/g, '-') // Replace multiple dashes with a single dash
      .replace(/^-|-$/g, ''); // Remove leading or trailing dashes
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
