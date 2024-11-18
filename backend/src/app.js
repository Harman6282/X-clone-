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
import commentRouter from "./routes/comment.routes.js"
import { apiError } from "./utils/apiError.js";


app.use("/api/v1/users" , userRouter)
app.use("/api/v1/f" , followRouter)
app.use("/api/v1/tweet" , tweetRouter)
app.use("/api/v1/comment" , commentRouter)

app.use((err, req, res, next) => {
  if (err instanceof apiError) {
    // Handle custom `apiError`
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "An unexpected error occurred",
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Send stack trace only in development
    });
  }
  // Handle other errors (e.g., unexpected errors)
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app };
