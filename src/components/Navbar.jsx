import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { useAuth } from "../hooks/use-auth"; // ✅ named import

function NavBar() {
  const { auth, setAuth } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      {/* React Router will pass components into the <Outlet /> based on the path */}
      <Outlet />
    </div>
  );
}

export default NavBar;
