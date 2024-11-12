import { Router } from "express";
import { postTweet } from "../controllers/tweet.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/post").post(verifyUser, upload.single("media")  ,postTweet);

export default router;
