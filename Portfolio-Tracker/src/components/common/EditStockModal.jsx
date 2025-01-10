/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { useStocks } from "../../context/StockContext";
import { FaCheck, FaTimes } from "react-icons/fa";

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const STOCK_API_URL = "https://finnhub.io/api/v1/quote";

const EditStockModal = ({ stock, onCancel }) => {
  const { editStock } = useStocks();
  const [formData, setFormData] = useState(stock);
  const [currentPrice, setCurrentPrice] = useState(stock.buyPrice);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          setErrorMessage("");
        }
      } catch (error) {
        setErrorMessage(`Failed to fetch stock price for ${ticker}. Please try again.`);
      }
    };

    const debouncedFetchStockPrice = debounce(fetchStockPrice, 500);
    debouncedFetchStockPrice(formData.ticker);

    return () => {
      debouncedFetchStockPrice.cancel();
    };
  }, [formData.ticker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._id) {
      await editStock(formData);
      onCancel();
    } else {
      console.error("Stock ID is missing");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-5  p-6 sm:mx-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center sm:text-left">✏️ Edit Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Stock Name</label>
            <input
              type="text"
              name="stockName"
              value={formData.stockName}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Ticker</label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={formData.buyPrice}
              readOnly
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 focus:outline-none"
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <div className="flex flex-col sm:flex-row justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-600 text-white px-6 py-2 rounded-lg mb-2 sm:mb-0 sm:mr-2 flex items-center space-x-2 hover:bg-red-700 focus:outline-none"
            >
              <FaTimes /> <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 focus:outline-none"
            >
              <FaCheck /> <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
