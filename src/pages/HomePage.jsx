import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-gray-900">This is the home page.</h1>
      <Link
        to="/clubs/create"
        className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Create book club
      </Link>
    </div>
  );
}

export default HomePage;
