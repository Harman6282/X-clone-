import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  followUser,
  getCurrentUser,
  logoutUser,
  registerUser,
  signinUser,
  unfollowUser,
  updateAccoutDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(signinUser);
router.route("/signout").post(verifyUser, logoutUser);
router.route("/current-user").get(verifyUser, getCurrentUser);
router.route("/update-User").patch(verifyUser, updateAccoutDetails);
router
  .route("/update-avatar")
  .patch(verifyUser, upload.single("avatar"), updateAvatar);
router
  .route("/update-coverImage")
  .patch(verifyUser, upload.single("coverImage"), updateCoverImage);

router.route("/follow/:followTo_id").patch(verifyUser, );
router.route("/unfollow/:unfollowTo_id").patch(verifyUser, unfollowUser);


export default router;
