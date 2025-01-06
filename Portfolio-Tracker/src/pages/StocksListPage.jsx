import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useStocks } from "../context/StockContext"; // Importing StockContext
import StocksTable from "../components/products/StocksTable";

const StocksListPage = () => {
    const { stocks, loading } = useStocks();

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Current Stocks" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <StocksTable stocks={stocks} />
                    </>
                )}
            </main>
        </div>
    );
};

export default StocksListPage;
