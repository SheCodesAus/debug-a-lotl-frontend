import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/use-auth"; // ✅ named import

function NavBar() {
  const { auth, setAuth } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex gap-4 p-4 border-b border-gray-200 bg-white items-center">
        <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
          Home
        </Link>
        <div className="ml-auto flex gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-md font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default NavBar;
