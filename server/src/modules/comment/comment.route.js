import express from "express";
import * as commentController from "./comment.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, commentController.createComment);

router.get(
  "/getProductComments/:productId",
  commentController.getProductComments
);

router.put(
  "/likeComment/:commentId",
  verifyToken,
  commentController.likeComment
);

router.put(
  "/editComment/:commentId",
  verifyToken,
  commentController.editComment
);

router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  commentController.deleteComment
);

router.get("/getcomments", verifyToken, commentController.getComments);

export default router;
