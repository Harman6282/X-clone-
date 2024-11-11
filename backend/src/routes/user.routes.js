import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getCurrentUser,
  getUserProfile,
  logoutUser,
  registerUser,
  signinUser,
  updateAccoutDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(signinUser);
router.route("/u/:id").get(getUserProfile);
router.route("/signout").post(verifyUser, logoutUser);
router.route("/current-user").get(verifyUser, getCurrentUser);
router.route("/update-User").patch(verifyUser, updateAccoutDetails);
router
  .route("/update-avatar")
  .patch(verifyUser, upload.single("avatar"), updateAvatar);
router
  .route("/update-coverImage")
  .patch(verifyUser, upload.single("coverImage"), updateCoverImage);

export default router;
