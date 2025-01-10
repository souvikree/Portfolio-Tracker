/* eslint-disable no-unused-vars */
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import EditStockModal from "../common/EditStockModal";
import { useStocks } from "../../context/StockContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchStockPrices = async (ticker) => {
  try {
    const response = await axios.get(`${API_URL}/api/stocks/stocks/${ticker}`);
    return response.data.currentPrice || 0;
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
    return 0;
  }
};

const updateStockPriceAndProfitLoss = async (stock) => {
  try {
    const stockPriceData = await fetchStockPrices(stock.ticker);
    const currentPrice = stockPriceData || stock.currentPrice;
    const profitLoss = currentPrice
      ? ((currentPrice - stock.buyPrice) * stock.quantity).toFixed(2)
      : stock.profitLoss;

    return { ...stock, currentPrice, profitLoss };
  } catch (err) {
    console.error(`Error updating stock ${stock.ticker}:`, err.message);
    return stock;
  }
};

const StocksTable = () => {
  const { deleteStock, editStock, error } = useStocks();
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/stocks`);
      const stocksData = response.data;

      const updatedStocks = await Promise.all(
        stocksData.map((stock) => updateStockPriceAndProfitLoss(stock))
      );

      setStocks(updatedStocks);
    } catch (err) {
      console.error("Error fetching stocks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStocks();
  }, []);

  useEffect(() => {
    const totalValue = stocks.reduce(
      (sum, stock) => sum + stock.currentPrice * stock.quantity,
      0
    );
    setPortfolioValue(totalValue);
  }, [stocks]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = stocks.filter(
        (stock) =>
          stock.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, stocks]);

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedStock) => {
    await editStock(updatedStock);
    setIsEditModalOpen(false);
    refreshStocks();
  };

  const handleDelete = async (id, stockName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the stock: ${stockName}?`
    );
    if (confirmed) {
      alert(`The stock ${stockName} is being deleted.`);
      await deleteStock(id);
      refreshStocks();
    }
  };

  if (loading) return <DotLottieReact
  src="https://lottie.host/e2c61ba4-21e4-40f9-a0db-7b2d24c6e957/C478Vf7tEE.lottie"
  loop
  autoplay
/>
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-6 mb-10">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Stock Portfolio 📈
        </h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Stocks..."
            className="w-full sm:w-72 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        {/* Uncomment if portfolio value needs display */}
        {/* <p className="text-gray-300 text-sm">
      Total Portfolio Value:{" "}
      <span className="text-green-400">${portfolioValue.toFixed(2)}</span>
    </p> */}
        <button
          onClick={refreshStocks}
          className="w-full sm:w-auto text-white px-4 py-2 rounded-full bg-blue-500 shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          Refresh Table 🔄
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ticker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Buy Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Profit/Loss
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredStocks.map((stock) => (
              <tr key={stock._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 text-bold text-gray-100">
                  {stock.stockName}
                </td>
                <td className="px-2 mx-6 my-4 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-800 text-indigo-100">
                  {stock.ticker}
                </td>
                <td className="px-10 py-4 text-gray-300">{stock.quantity}</td>
                <td className="px-6 py-4 text-green-500">
                  ${stock.buyPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-blue-400">
                  $
                  {stock.currentPrice?.toFixed(2) ||
                    (loading ? "Loading..." : "N/A")}
                </td>
                <td
                  className={`px-6 py-4 ${
                    stock.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${stock.profitLoss || "0.00"}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEdit(stock)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(stock._id, stock.stockName)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <EditStockModal
          stock={editingStock}
          onSave={handleSave}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StocksTable;
