import express from "express";
import * as checkoutController from "./checkout.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, checkoutController.create);

export default router;
