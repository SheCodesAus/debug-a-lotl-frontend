import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth"; // ✅ named import

function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const isLoggedIn = Boolean(auth?.token && auth?.username);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("user_id");
    setAuth({ token: null, user_id: null, username: null });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex gap-4 p-4 border-b border-gray-200 bg-white items-center">
        <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
          Home
        </Link>
        <Link to="/clubs" className="font-medium text-blue-600 hover:text-blue-700">
          Book clubs
        </Link>
        {isLoggedIn && (
          <Link to="/profile" className="font-medium text-blue-600 hover:text-blue-700">
            Profile
          </Link>
        )}
        <div className="ml-auto flex gap-2 items-center">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700 font-medium">
                Hi, {auth.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-md font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>
      <main className="flex-1 bg-[#fffaf6] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default NavBar;
