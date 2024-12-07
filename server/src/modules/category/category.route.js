import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import * as categoryController from "./category.controller.js";

const router = express.Router();

router.post("/create", verifyToken, categoryController.createCategory);

router.get("/getcategories", categoryController.getCategories);

router.delete(
  "/deletecategory/:categoryId",
  verifyToken,
  categoryController.deleteCategory
);

router.put(
  "/updatecategory/:categoryId",
  verifyToken,
  categoryController.updateCategory
);

export default router;
