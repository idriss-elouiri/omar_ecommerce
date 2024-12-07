import { errorHandler } from "../../utils/error.js";
import Product from "./product.model.js";

// Helper function to create a slug from the product title
const generateSlug = (title) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]+/g, '-') // Replace non-alphanumeric characters with a dash
    .replace(/-+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-|-$/g, ''); // Remove leading or trailing dashes
};

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a product"));
  }

  const slug = generateSlug(req.body.title);
  
  const newProduct = new Product({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const filterOptions = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const [products, totalProducts, lastMonthProducts] = await Promise.all([
      Product.find(filterOptions)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit),
      Product.countDocuments(filterOptions),
      Product.countDocuments({
        createdAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }, // Count products created in the last month
      }),
    ]);

    res.status(200).json({
      products,
      totalProducts,
      lastMonthProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this product"));
  }

  try {
    await Product.findByIdAndDelete(req.params.productId);
    return res.status(200).json({ message: "The product has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this product"));
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body }, // Use req.body directly to allow updating all fields at once
      { new: true, runValidators: true } // Ensures that the updated fields are validated
    );

    if (!updatedProduct) {
      return next(errorHandler(404, "Product not found"));
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
