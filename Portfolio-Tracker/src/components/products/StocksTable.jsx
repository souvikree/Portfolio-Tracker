import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

// Example API response for fetching stock prices
const fetchStockPrices = async (ticker) => {
  const mockPrices = {
    AAPL: 150.23,
    GOOGL: 2805.67,
    AMZN: 3405.12,
    MSFT: 299.45,
  };
  return mockPrices[ticker] || 0;
};

// Initial stock data
const initialStocks = [
  { id: 1, name: "Apple", ticker: "AAPL", quantity: 10, buyPrice: 145 },
  { id: 2, name: "Google", ticker: "GOOGL", quantity: 5, buyPrice: 2700 },
  { id: 3, name: "Amazon", ticker: "AMZN", quantity: 8, buyPrice: 3300 },
];

const StocksTable = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState(initialStocks);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  // Fetch current prices and calculate profit/loss
  useEffect(() => {
    const updateStocksWithPrices = async () => {
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const currentPrice = await fetchStockPrices(stock.ticker);
          const profitLoss = ((currentPrice - stock.buyPrice) * stock.quantity).toFixed(2);
          return { ...stock, currentPrice, profitLoss };
        })
      );
      setStocks(updatedStocks);

      // Update total portfolio value
      const totalValue = updatedStocks.reduce(
        (sum, stock) => sum + stock.currentPrice * stock.quantity,
        0
      );
      setPortfolioValue(totalValue);
    };

    updateStocksWithPrices();
  }, [stocks]);

  // Handle search functionality
  useEffect(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchTerm, stocks]);

  // Handle edit modal
  const handleEdit = (stock) => {
    setEditingStock(stock);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedStock) => {
    setStocks((prev) =>
      prev.map((stock) => (stock.id === updatedStock.id ? updatedStock : stock))
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setStocks((prev) => prev.filter((stock) => stock.id !== id));
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-xl p-6 mb-10">
      {/* Header Section */}
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

      {/* Portfolio Value */}
      <p className="text-gray-300 mb-4">
        Total Portfolio Value:{" "}
        <span className="text-green-400">${portfolioValue.toFixed(2)}</span>
      </p>

      {/* Table Section */}
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
              <tr key={stock.id}>
                <td className="px-6 py-4 text-bold text-gray-100">{stock.name}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{stock.ticker}</td>
                <td className="px-6 py-4 text-gray-300">{stock.quantity}</td>
                <td className="px-6 py-4 text-green-500">${stock.buyPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-blue-400">
                  ${stock.currentPrice?.toFixed(2) || "Loading..."}
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
                    onClick={() => handleDelete(stock.id)}
                  >
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
        <EditStockModal
          stock={editingStock}
          onSave={handleSave}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

const EditStockModal = ({ stock, onSave, onCancel }) => {
  const [formData, setFormData] = useState(stock);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ticker</label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={formData.buyPrice}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
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

export default StocksTable;
