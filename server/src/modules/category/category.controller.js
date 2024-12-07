import Category from "./category.model.js";
import { errorHandler } from "../../utils/error.js";

export async function createCategory(req, res, next) {
  const { name, parent, properties } = req.body;

  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a category"));
  }

  try {
    const newCategory = new Category({
      userId: req.user.id,
      name,
      parent: parent || undefined,
      properties,
    });
    await newCategory.save();
    res.status(201).json("Created Category successfully");
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().populate("parent");
    res.status(200).json(categories); // Use 200 for successful GET
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  const { name, parent, properties } = req.body;

  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to update this category")
    );
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        $set: {
          name,
          parent: parent || undefined, 
          properties,
        },
      },
      { new: true, runValidators: true } // Ensure validation on update
    );

    if (!updatedCategory) {
      return next(errorHandler(404, "Category Not Found")); // Handle case where category doesn't exist
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to delete this category")
    );
  }

  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );
    if (!deletedCategory) {
      return next(errorHandler(404, "Category Not Found"));
    }
    res.status(200).json("Category deleted successfully");
  } catch (error) {
    next(error);
  }
}
