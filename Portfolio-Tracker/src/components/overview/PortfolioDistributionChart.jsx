/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Portfolio Distribution</h2>


      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
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
                return [`$${stock ? stock.price.toFixed(2) : 0}`, `Quantity: ${stock ? stock.quantity : 0}`];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PortfolioDistributionChart;
