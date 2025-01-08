import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const STOCK_API_URL="https://finnhub.io/api/v1/quote";
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const AddStock = ({ isOpen, onClose, onAddStock }) => {
  const [formData, setFormData] = useState({
    stockName: "",
    ticker: "",
    quantity: "",
    buyPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form data when modal opens
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        stockName: "",
        ticker: "",
        quantity: "",
        buyPrice: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchStockPrice = async (ticker) => {
      if (!ticker) return;

      try {
        const response = await axios.get(`${STOCK_API_URL}?symbol=${ticker}&token=${API_KEY}`);
        if (response.data && response.data.c) {
          setCurrentPrice(response.data.c);
          setFormData((prevData) => ({
            ...prevData,
            buyPrice: response.data.c,
          }));
        }
      } catch (error) {
        setErrorMessage(`Failed to fetch {${ticker}} stock price. Please try again.`);
        setAlertMessage("");
      }
    };

    const debouncedFetchStockPrice = debounce(fetchStockPrice, 500);
    debouncedFetchStockPrice(formData.ticker);

    return () => {
      debouncedFetchStockPrice.cancel();
    };
  }, [formData.ticker]);

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

    if (currentPrice && parseFloat(formData.buyPrice) !== currentPrice) {
      alert("The buy price must be equal to the current market price.");
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
      const response = await axios.post(`${API_URL}/`, stockData);
      if (response.status === 200) {
        onAddStock(stockData);
        setAlertMessage(`Your ${formData.stockName} is being added.`);
        setTimeout(() => {
          setAlertMessage("");
          onClose();
        }, 3000);
      }
    } catch (error) {
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

        {alertMessage && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <span className="font-medium">Success alert!</span> {alertMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">Error:</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="stockName" className="block text-gray-700 font-medium">Stock Name</label>
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
            <label htmlFor="ticker" className="block text-gray-700 font-medium">Ticker Symbol</label>
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
            <label htmlFor="quantity" className="block text-gray-700 font-medium">Quantity</label>
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
            <label htmlFor="buyPrice" className="block text-gray-700 font-medium">Buy Price (per unit)</label>
            <input
              type="number"
              id="buyPrice"
              name="buyPrice"
              value={formData.buyPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 text-black"
              placeholder="e.g., 145.50"
              required
              min={currentPrice}
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
