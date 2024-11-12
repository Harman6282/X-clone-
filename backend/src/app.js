import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import followRouter from "./routes/follow.routes.js"
import tweetRouter from "./routes/tweet.routes.js"


app.use("/api/v1/users" , userRouter)
app.use("/api/v1/f" , followRouter)
app.use("/api/v1/tweet" , tweetRouter)


export { app };
