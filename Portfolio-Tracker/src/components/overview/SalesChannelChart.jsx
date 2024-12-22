/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useEffect, useState } from "react";

// Example of stock data with symbols and quantities
const initialStocks = [
  { symbol: "AAPL", quantity: 10 },
  { symbol: "GOOGL", quantity: 5 },
  { symbol: "AMZN", quantity: 8 },
  { symbol: "MSFT", quantity: 12 },
  { symbol: "TSLA", quantity: 6 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

// Mock function to fetch real-time stock prices (replace with a real API)
const fetchStockPrices = async (symbol) => {
  const mockPrices = {
    AAPL: 150.23,
    GOOGL: 2805.67,
    AMZN: 3405.12,
    MSFT: 299.45,
    TSLA: 700.12,
  };
  return mockPrices[symbol] || 0;
};

const SalesChannelChart = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [stockData, setStockData] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);

  // Fetch real-time stock data and update portfolio value
  useEffect(() => {
    const fetchData = async () => {
      let totalValue = 0;
      const updatedStockData = await Promise.all(
        stocks.map(async (stock) => {
          const price = await fetchStockPrices(stock.symbol);
          const value = price * stock.quantity;
          totalValue += value;
          return { name: stock.symbol, value, price, quantity: stock.quantity };
        })
      );
      setStockData(updatedStockData);
      setPortfolioValue(totalValue);
    };
    fetchData();
  }, [stocks]);

  // Prepare data for the BarChart
  const categoryData = stockData.map((stock) => ({
    name: stock.name,
    value: stock.value,
  }));

  return (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Portfolio Distribution</h2>

      {/* Display Total Portfolio Value
      <p className="text-gray-300 mb-6">
        <span className="font-semibold">Total Portfolio Value: </span>
        <span className="text-green-400">${portfolioValue.toFixed(2)}</span>
      </p> */}

      <div className="h-80">
        <ResponsiveContainer >
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value, name, props) => {
                const stock = stockData.find((stock) => stock.name === name);
                return [`$${stock ? stock.price.toFixed(2) : 0}`, `Quantity: ${stock ? stock.quantity : 0}`];
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
	</div>
  );
};

export default SalesChannelChart;
