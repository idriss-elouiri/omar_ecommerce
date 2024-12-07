import Comment from "./comment.model.js";
import { errorHandler } from "../../utils/error.js";

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { content, productId, userId } = req.body; // Destructure for clarity
    const currentUserId = req.user.id;

    // Check if the user is allowed to create this comment
    if (currentUserId !== userId) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    const newComment = new Comment({
      content,
      productId,
      userId: currentUserId,
    });
    await newComment.save();

    res.status(201).json(newComment); // Respond with 201 for created resources
  } catch (error) {
    next(error);
  }
};

// Get comments for a specific product
export const getProductComments = async (req, res, next) => {
  try {
    const { productId } = req.params; // Destructure for clarity
    const comments = await Comment.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Like or unlike a comment
export const likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params; // Destructure for clarity
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userId = req.user.id;
    const userIndex = comment.likes.indexOf(userId);

    // Toggle like status
    if (userIndex === -1) {
      comment.numberOfLikes += 1; // Increment likes
      comment.likes.push(userId);
    } else {
      comment.numberOfLikes -= 1; // Decrement likes
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Edit a comment
export const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params; // Destructure for clarity
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Check if the user is allowed to edit the comment
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    comment.content = req.body.content; // Update content
    const updatedComment = await comment.save(); // Save updated comment

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params; // Destructure for clarity
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Check if the user is allowed to delete the comment
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};

// Get all comments (for admin)
export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all comments"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const oneMonthAgo = new Date(
      new Date().setMonth(new Date().getMonth() - 1)
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
