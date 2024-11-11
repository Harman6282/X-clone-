import { toggleFollow } from "../controllers/follow.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/toggle-follow/:userId").patch(verifyUser, toggleFollow);

export default router;
