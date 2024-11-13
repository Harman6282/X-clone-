import { Router } from "express";
import {
  deleteTweet,
  getAllTweets,
  getFollowingUsersTweets,
  getTweetById,
  postTweet,
  toggleTweetLike,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/post").post(verifyUser, upload.single("media"), postTweet);
router
  .route("/update-tweet/:tweetId")
  .patch(verifyUser, upload.single("media"), updateTweet);
router.route("/delete-tweet/:tweetId").delete(verifyUser, deleteTweet);
router.route("/tweets").get(verifyUser, getAllTweets);
router.route("/:tweetId").get(verifyUser, getTweetById);
router.route("/toggle-like-tweet/:tweetId").patch(verifyUser, toggleTweetLike);
router.route("/followings-tweets").patch(verifyUser, getFollowingUsersTweets);

export default router;
