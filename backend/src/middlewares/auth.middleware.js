import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.user).select("-password -avatar_public_id -coverImage_public_id");

    if (!user) {
      throw new apiError(401, "Invalid token");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new apiError(401, err?.message, "Invalid token");
  }
});
