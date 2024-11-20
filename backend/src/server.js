import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server started successfully at port: ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Error while starting server or connecting the MONGODB");
  });
