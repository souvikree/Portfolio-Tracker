/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { useStocks } from "../../context/StockContext";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const PortfolioDistributionChart = () => {
  const { stocks, fetchStockPrices } = useStocks();
  const [stockData, setStockData] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);

  // Fetch real-time stock data and update portfolio value
  useEffect(() => {
    const fetchData = async () => {
      let totalValue = 0;
      const updatedStockData = await Promise.all(
        stocks.map(async (stock) => {
          const price = await fetchStockPrices(stock.ticker);
          const value = price * stock.quantity;
          totalValue += value;
          return { name: stock.ticker, value, price, quantity: stock.quantity };
        })
      );
      setStockData(updatedStockData);
      setPortfolioValue(totalValue);
    };
    fetchData();
  }, [fetchStockPrices, stocks]);

  // Format the data for the pie chart
  const categoryData = stockData.map((stock) => ({
    name: stock.name,
    value: stock.value,
  }));

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700 transition-all duration-300 ease-in-out"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-100">
          Portfolio Distribution
        </h2>
        <span className="text-gray-300 text-xl">📊</span>
      </div>

      <div className="h-64 sm:h-80 text-[0.5rem] sm:text-[1rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="60%"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value, name, props) => {
                const stock = stockData.find((stock) => stock.name === name);
                return [
                  `$${stock ? stock.price.toFixed(2) : 0}`,
                  `Quantity: ${stock ? stock.quantity : 0}`,
                ];
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "0.8rem",
                textAlign: "center",
                color: "#A0AEC0",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4 text-sm text-gray-400">
        {/* <p>Total Portfolio Value: <span className="text-green-400">${portfolioValue.toFixed(2)}</span></p> */}
        <p className="text-sm text-gray-500">🔄 Refresh your portfolio anytime!</p>
      </div>
    </motion.div>
  );
};

export default PortfolioDistributionChart;
