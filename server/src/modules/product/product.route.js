import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import * as productController from "./product.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { productSchema } from "./product.shcema.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  validateZod(productSchema),
  productController.create
);

router.get("/getproducts", productController.getProducts);

router.delete(
  "/deleteproduct/:productId/:userId",
  verifyToken,
  productController.deleteProduct
);

router.put(
  "/updateproduct/:productId/:userId",
  verifyToken,
  productController.updateProduct
);

export default router;
