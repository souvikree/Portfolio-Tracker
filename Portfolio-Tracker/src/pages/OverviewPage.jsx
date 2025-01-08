import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { useStocks } from "../context/StockContext"; 
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/PortfolioDistributionChart";


const OverviewPage = () => {
  const { stocks, loading, error } = useStocks(); 
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  // Calculate the total portfolio value
  const totalValue = stocks.reduce(
    (sum, stock) => sum + stock.currentPrice * stock.quantity,
    0
  ).toFixed(2);

  const topPerformingStock = stocks.reduce((a, b) => (b.profitLoss > a.profitLoss ? b : a), stocks[0]);
  const lowPerformingStock = stocks.reduce((a, b) => (b.profitLoss < a.profitLoss ? b : a), stocks[0]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Stocks" icon={Package} value={stocks.length} color="#6366F1" />
          <StatCard
            name="Top Performing Stock"
            icon={TrendingUp}
            value={`${topPerformingStock.stockName} (${topPerformingStock.ticker})`} //
            color="#10B981"
          />
          <StatCard
            name="Low Stock"
            className={"text-red-500"}
            icon={AlertTriangle}
            value={`${lowPerformingStock.stockName} (${lowPerformingStock.ticker})`}
            color="#F59E0B"
          />
          <StatCard name="Total Portfolio Value" icon={DollarSign} value={`$${totalValue}`} color="#EF4444" />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryDistributionChart />
          {/* <CandleChart /> */}
        </div>
      </main>

      {/* <motion.div
        className="fixed bottom-4 right-4 z-20 bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer"
        onClick={refreshStocks} // Refresh the stock data on button click
      >
        Refresh Data
      </motion.div> */}
    </div>
  );
};

export default OverviewPage;
