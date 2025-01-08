import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddStock from "./AddStock";
import GoogleLoginModal from "./GoogleLoginModal"; // Import the GoogleLoginModal

const Header = ({ title, onAddStock }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false); // State for Google Login Modal
  const [user, setUser] = useState(null); // State for authenticated user info

  const showAddStockButton = ["/", "/current-stocks"].includes(location.pathname);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (userInfo) {
      setUser(userInfo); // Set user state if logged in
    }
  }, []);

  // Handle Sign Out
  // const handleSignOut = () => {
  //   localStorage.removeItem("user-info");
  //   setUser(null); // Clear user state on sign out
  // };

  return (
    <>
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-700 rounded-b-xl mx-4 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
          <div className="flex space-x-4">
            {showAddStockButton && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition"
              >
                Add Stock
              </button>
            )}
            {/* If user is authenticated, show profile, else show Sign In button */}
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")} // Navigate to settings page
                  className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition"
                >
                  {user.name}
                </button>
                {/* <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-red-700 focus:ring focus:ring-red-400 transition"
                >
                  Sign Out
                </button> */}
              </>
            ) : (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-green-700 focus:ring focus:ring-green-400 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AddStock
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStock={onAddStock}
      />

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)} // Close the Google modal
      />
    </>
  );
};

export default Header;
