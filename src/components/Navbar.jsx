import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { useAuth } from "../hooks/use-auth"; // ✅ named import

function NavBar() {
  const { auth, setAuth } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex gap-4 p-4 border-b border-gray-200 bg-white">
        <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
          Home
        </Link>
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Login
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default NavBar;
