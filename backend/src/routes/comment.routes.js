import { Router  } from "express";
import {verifyUser} from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, editComment, toggleCommentLike } from "../controllers/comment.controller.js";

const router = Router();

router.route("/add-comment/:tweetId").post(verifyUser , addComment)
router.route("/edit-comment/:commentId").patch(verifyUser , editComment)
router.route("/delete-comment/:commentId").delete(verifyUser , deleteComment)
router.route("/toggle-like/:commentId").patch(verifyUser , toggleCommentLike)

export default router;