import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const STOCK_API_URL = "https://finnhub.io/api/v1/quote";
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const AddStock = ({ isOpen, onClose, onAddStock }) => {
  const [formData, setFormData] = useState({
    stockName: "",
    ticker: "",
    quantity: "",
    buyPrice: "",
  });
  const [stockSuggestions, setStockSuggestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStockSuggestions = debounce(async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`
      );
      const suggestions = response.data.result || [];
      // Only keep the first suggestion
      if (suggestions.length > 0) {
        setStockSuggestions([suggestions[0]]);
      } else {
        setStockSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching stock suggestions:", error);
    }
  }, 300);

  const selectSuggestion = (suggestion) => {
    setFormData({
      stockName: suggestion.description,
    });
    setStockSuggestions([]);
  };

  // const handleTabKey = (e) => {
  //   if (e.key === "Tab" && stockSuggestions.length > 0) {
  //     setFormData({
  //       ...formData,
  //       stockName: stockSuggestions[0].description,
  //     });
  //     e.preventDefault(); // Prevent the default tab behavior
  //   }
  // };

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
        const response = await axios.get(
          `${STOCK_API_URL}?symbol=${ticker}&token=${API_KEY}`
        );
        if (response.data && response.data.c) {
          setCurrentPrice(response.data.c);
          setFormData((prevData) => ({
            ...prevData,
            buyPrice: response.data.c,
          }));
        }
      } catch (error) {
        setErrorMessage(
          `Failed to fetch {${ticker}} stock price. Please try again.`
        );
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "stockName") {
      fetchStockSuggestions(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.stockName ||
      !formData.ticker ||
      !formData.quantity ||
      !formData.buyPrice
    ) {
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
      const response = await axios.post(`${API_URL}/api/stocks`, stockData);
      if (response.status === 200) {
        onAddStock(stockData);
        setAlertMessage(`Your ${formData.stockName} is being added.`);
        setTimeout(() => {
          setAlertMessage("");
          onClose();
        }, 3000);
      }
    } catch (error) {
      alert(
        "Failed to add stock: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-[500px] p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Add Stock</h2>

        {alertMessage && (
          <div
            className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">Success!</span> {alertMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">Error:</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="stockName"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="stockName"
                name="stockName"
                value={formData.stockName}
                onChange={handleInputChange}
                // onKeyDown={handleTabKey}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                placeholder="e.g., Apple Inc."
                required
              />
              {stockSuggestions.length > 0 && (
                <div className="absolute top-0 left-0 mt-12 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-black">
                  {stockSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="ticker"
              className="block text-sm font-medium text-gray-700"
            >
              Ticker Symbol
            </label>
            <input
              type="text"
              id="ticker"
              name="ticker"
              value={formData.ticker}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="e.g., AAPL"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="e.g., 10"
              required
            />
          </div>

          <div>
            <label
              htmlFor="buyPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Buy Price (per unit)
            </label>
            <input
              type="number"
              id="buyPrice"
              name="buyPrice"
              value={formData.buyPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="e.g., 145.50"
              required
              min={currentPrice}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 ${
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
