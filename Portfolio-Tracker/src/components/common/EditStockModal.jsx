/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { useStocks } from "../../context/StockContext";

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 
const STOCK_API_URL = "https://finnhub.io/api/v1/quote"; 

const EditStockModal = ({ stock, onCancel }) => {
  const { editStock } = useStocks();
  const [formData, setFormData] = useState(stock);
  const [currentPrice, setCurrentPrice] = useState(stock.buyPrice); 
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch stock price on ticker change
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

  // Handle form submission
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
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Stock Name</label>
            <input
              type="text"
              name="stockName"
              value={formData.stockName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ticker</label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={formData.buyPrice}
              readOnly // Make it read-only since it updates automatically
              className="mt-1 block w-full p-2 border rounded text-black bg-gray-100"
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
