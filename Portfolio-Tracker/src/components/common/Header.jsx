import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Header = ({ title, onAddStock }) => {
  const location = useLocation(); // Hook to get the current route
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for stock addition
  const [formData, setFormData] = useState({
    stockName: "",
    ticker: "",
    quantity: "",
    buyPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State for handling submission status
  const [portfolioValue, setPortfolioValue] = useState(0); // State to track the portfolio value

  // Handle form input changes for stock data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding a stock
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.stockName || !formData.ticker || !formData.quantity || !formData.buyPrice) {
      alert("Please fill out all fields.");
      return;
    }

    const stockData = {
      stockName: formData.stockName,
      ticker: formData.ticker,
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
    };

    setIsSubmitting(true); // Set submission state to true
    try {
      // Send a POST request to the backend
      const response = await axios.post("http://localhost:8080/api/stocks/add", stockData);

      if (response.status === 200) {
        // Success: Update portfolio value and pass data to parent
        const newStockValue = stockData.quantity * stockData.buyPrice;
        setPortfolioValue(portfolioValue + newStockValue);
        onAddStock(stockData);

        // Reset form and close modal
        setFormData({ stockName: "", ticker: "", quantity: "", buyPrice: "" });
        setIsModalOpen(false);
        alert("Stock added successfully!");
      }
    } catch (error) {
      // Handle errors (e.g., display error message)
      console.error("Error adding stock:", error.response?.data || error.message);
      alert("Failed to add stock: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  // Define routes where the "Add Stock" button should appear
  const showAddStockButton = ["/", "/current-stocks"].includes(location.pathname);

  return (
    <>
      {/* Header Section */}
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
          </div>
        </div>
      </header>

      {/* Add Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Stock</h2>
            <form onSubmit={handleSubmit}>
              {/* Stock Name */}
              <div className="mb-4">
                <label htmlFor="stockName" className="block text-gray-700 font-medium">
                  Stock Name
                </label>
                <input
                  type="text"
                  id="stockName"
                  name="stockName"
                  value={formData.stockName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400"
                  placeholder="e.g., Apple Inc."
                  required
                />
              </div>

              {/* Ticker Symbol */}
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

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 focus:ring focus:ring-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-400 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Stock"}
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
