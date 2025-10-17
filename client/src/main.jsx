import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdsList from "./pages/ads/AdsList.jsx";
import AdDetail from "./pages/ads/AdDetail.jsx";
import NewAd from "./pages/ads/NewAd.jsx";
import MyAds from "./pages/ads/MyAds.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/ads", element: <AdsList /> },
  { path: "/ads/new", element: <NewAd /> },
  { path: "/ads/mine", element: <MyAds /> },
  { path: "/ads/:id", element: <AdDetail /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
