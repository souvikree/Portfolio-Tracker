import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddStock from "./AddStock";
import GoogleLoginModal from "./GoogleLoginModal";

const Header = ({ title, onAddStock }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const showAddStockButton = ["/", "/current-stocks"].includes(location.pathname);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <>
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-700 rounded-b-xl mx-4 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>

          {/* Desktop View */}
          <div className="hidden sm:flex space-x-4">
            {showAddStockButton && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition"
              >
                Add Stock
              </button>
            )}
            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition"
              >
                {user.name}
              </button>
            ) : (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-green-700 focus:ring focus:ring-green-400 transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile View */}
          <button
            className="sm:hidden text-gray-100 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="sm:hidden px-4 pb-4">
            {showAddStockButton && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="block w-full bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition mb-2"
              >
                Add Stock
              </button>
            )}
            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="block w-full bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition"
              >
                {user.name}
              </button>
            ) : (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="block w-full bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-green-700 focus:ring focus:ring-green-400 transition"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      <AddStock
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStock={onAddStock}
      />

      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </>
  );
};

export default Header;
