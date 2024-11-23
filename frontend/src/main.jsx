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
import AuthUser from "./components/AuthUser";
import App from "./App";
import StandaloneLayout from "./StandloneLayout";
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import store from './store/store';
import { Bookmark } from "react-feather";
import TweetById from "./components/TweetById";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/tweet/:tweetId" element={<TweetById />} />
      </Route>
      <Route path="/" element={<StandaloneLayout />}>
        <Route path="/signup" element={<AuthUser type={"signup"} />} />
        <Route path="/signin" element={<AuthUser type={"signin"} />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store
  }>
  <StrictMode >
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
  </Provider>
);
