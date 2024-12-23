import { useState } from "react";
import { useLocation } from "react-router-dom";
import GoogleLoginModal from "./GoogleLoginModal";  // Ensure this component is implemented for Google login

const Header = ({ title, onAddStock }) => {
  const location = useLocation(); // Hook to get the current route
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state for stock addition
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);  // Modal state for Google login
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    quantity: "",
    buyPrice: "",
  });
  const [portfolioValue, setPortfolioValue] = useState(0);  // State to track the portfolio value

  // Handle form input changes for stock data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding a stock
  const handleSubmit = (e) => {
    e.preventDefault();
    const newStockValue = parseFloat(formData.quantity) * parseFloat(formData.buyPrice);
    setPortfolioValue(portfolioValue + newStockValue);  // Update portfolio value
    onAddStock(formData);  // Pass the stock data to the parent component
    setFormData({ name: "", ticker: "", quantity: "", buyPrice: "" });  // Clear form data
    setIsModalOpen(false);  // Close the modal
  };

  // Define routes where the "Add Stock" button should appear
  const showAddStockButton = ["/", "/current-stocks"].includes(location.pathname);

  return (
    <>
      {/* Header Section */}
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-700 rounded-b-xl mx-4 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>

          {/* Actions (Login and Add Stock) */}
          <div className="flex space-x-4">
            {/* Signin Button */}
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="text-white text-sm font-medium py-2 px-4 hover:text-blue-400 transition"
            >
              Signin
            </button>

            {/* Add Stock Button (only visible on certain routes) */}
            {showAddStockButton && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 transition"
              >
                Add Stock
              </button>
            )}
          </div>
        </div>
      </header>

      {isGoogleModalOpen && (
        <GoogleLoginModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}  // Close modal when done
        />
      )}

      {/* Add Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Stock Details</h2>
            <form onSubmit={handleSubmit}>
              {/* Stock Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium">
                  Stock Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400"
                  placeholder="e.g., Apple Inc."
                  required
                />
              </div>

              {/* Stock Ticker */}
              <div className="mb-4">
                <label htmlFor="ticker" className="block text-gray-700 font-medium">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  id="ticker"
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400"
                  placeholder="e.g., AAPL"
                  required
                />
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-gray-700 font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400"
                  placeholder="e.g., 10"
                  required
                />
              </div>

              {/* Buy Price */}
              <div className="mb-4">
                <label htmlFor="buyPrice" className="block text-gray-700 font-medium">
                  Buy Price (per unit)
                </label>
                <input
                  type="number"
                  id="buyPrice"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400"
                  placeholder="e.g., 145.50"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}  // Close modal when Cancel is clicked
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 focus:ring focus:ring-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
