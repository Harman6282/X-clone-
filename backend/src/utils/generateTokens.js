import jwt from "jsonwebtoken";
import { apiError } from "./apiError.js";
// require("dotenv").config();

async function generateAndSetToken(user, res) {
  let token = await jwt.sign({user}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("accessToken", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
     sameSite: "strict"
  });
}


async function decodeJWT(token) {
  let decoded = await jwt.decode(token);
  return decoded;
}

export { generateAndSetToken,decodeJWT };
