import express from "express";
import * as orderController from "./order.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.get("/get", verifyToken, orderController.getOrder);

export default router;
