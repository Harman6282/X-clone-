import jwt from "jsonwebtoken";

async function generateAndSetToken(user, res) {
  let token = await jwt.sign({user}, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("accessToken", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });

}


async function decodeJWT(token) {
  let decoded = await jwt.decode(token);
  return decoded;
}

export { generateAndSetToken,decodeJWT };
