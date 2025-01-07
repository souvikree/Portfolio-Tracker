import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import EditStockModal from "../common/EditStockModal"; 
import { useStocks } from "../../context/StockContext";
const fetchStockPrices = async (ticker) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/stocks/stocks/${ticker}`);
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
  const { deleteStock, editStock } = useStocks();
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getStocks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/stocks/");
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
    getStocks();
  }, []);

  // Update total portfolio value
  useEffect(() => {
    const totalValue = stocks.reduce(
      (sum, stock) => sum + stock.currentPrice * stock.quantity,
      0
    );
    setPortfolioValue(totalValue);
  }, [stocks]);

  // Handle search functionality with debouncing
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

  // Handle edit modal
  const handleEdit = (stock) => {
    setEditingStock(stock);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedStock) => {
    await editStock(updatedStock); 
    setIsEditModalOpen(false);
};

  const handleDelete = (id) => {
    deleteStock(id);
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-xl p-6 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Stock Portfolio</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Stocks..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <p className="text-gray-300 mb-4">
        Total Portfolio Value:{" "}
        <span className="text-green-400">${portfolioValue.toFixed(2)}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ticker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Buy Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Profit/Loss</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredStocks.map((stock) => (
              <tr key={stock._id}>
                <td className="px-6 py-4 text-bold text-gray-100">{stock.stockName}</td>
                <td className="px-2 mx-6 my-4 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">{stock.ticker}</td>
                <td className="px-10 py-4 text-gray-300">{stock.quantity}</td>
                <td className="px-6 py-4 text-green-500">${stock.buyPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-blue-400">
                  ${stock.currentPrice?.toFixed(2) || (loading ? "Loading..." : "N/A")}
                </td>
                <td className={`px-6 py-4 ${stock.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${stock.profitLoss || "0.00"}
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2" onClick={() => handleEdit(stock)}>
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(stock._id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Stock Modal */}
      {isEditModalOpen && (
        <EditStockModal stock={editingStock} onSave={handleSave} onCancel={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default StocksTable;
