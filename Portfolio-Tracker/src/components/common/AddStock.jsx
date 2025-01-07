import { useState } from "react";
import axios from "axios";

const AddStock = ({ isOpen, onClose, onAddStock }) => {
  const [formData, setFormData] = useState({
    stockName: "",
    ticker: "",
    quantity: "",
    buyPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8080/api/stocks/", stockData);
      if (response.status === 200) {
        onAddStock(stockData);
        setFormData({ stockName: "", ticker: "", quantity: "", buyPrice: "" });
        onClose();
        alert("Stock added successfully!");
      }
    } catch (error) {
      console.error("Error adding stock:", error.response?.data || error.message);
      alert("Failed to add stock: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Stock</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="mb-4 ">
            <label htmlFor="stockName" className="block text-gray-700 font-medium">
              Stock Name
            </label>
            <input
              type="text"
              id="stockName"
              name="stockName"
              value={formData.stockName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 text-black"
              placeholder="e.g., Apple Inc."
              required
            />
          </div>

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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 text-black"
              placeholder="e.g., AAPL"
              required
            />
          </div>

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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 text-black"
              placeholder="e.g., 10"
              required
            />
          </div>

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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 text-black"
              placeholder="e.g., 145.50"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default AddStock;
