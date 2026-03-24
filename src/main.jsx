import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider.jsx";

import "./index.css";

import NavBar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ClubPage from "./pages/ClubPage.jsx";
import ClubListPage from "./pages/ClubListPage.jsx";
import CreateClubPage from "./pages/CreateClubPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFound from "./pages/PageNotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "clubs/:clubId", element: <ClubPage /> },
      { path: "clubs", element: <ClubListPage /> },
      { path: "clubs/create", element: <CreateClubPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "*", element: <NotFound /> }, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);