import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import App from "./App";
import StandaloneLayout from "./StandloneLayout";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<StandaloneLayout />}>
        <Route path="/signup" element={<Signup type={"signup"} />} />
        <Route path="/signin" element={<Signup type={"signin"} />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-left"
      reverseOrder={false}
      toastOptions={{
        style: {
          backgroundColor: "white",
          color: "#000000",
        },
      }}
    />
  </StrictMode>
);
