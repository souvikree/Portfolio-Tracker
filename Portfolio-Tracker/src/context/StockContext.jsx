import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Set the API base URL from environment variables
const API_URL ="http://localhost:8080/api/stocks";

const StocksContext = createContext();

// Custom hook to use the StocksContext
export const useStocks = () => {
    return useContext(StocksContext);
};

const StocksProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch stock price and calculate profit/loss
    const fetchStockPrice = async (ticker) => {
        try {
            const response = await axios.get(`${API_URL}/stocks/${ticker}`);
            return response.data;
        } catch (err) {
            console.error(`Error fetching price for ${ticker}:`, err.message);
            return null;
        }
    };

    const updateStockPriceAndProfitLoss = async (stock) => {
        try {
            const stockPriceData = await fetchStockPrice(stock.ticker);
            const currentPrice = stockPriceData?.currentPrice || stock.currentPrice;
            const profitLoss = currentPrice
                ? ((currentPrice - stock.buyPrice) * stock.qty).toFixed(2)
                : stock.profitLoss;

            return { ...stock, currentPrice, profitLoss };
        } catch (err) {
            console.error(`Error updating stock ${stock.ticker}:`, err.message);
            return stock;
        }
    };

    // Fetch stocks from the backend and update their profit/loss
    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/`);
            const stocksData = response.data;

            const updatedStocks = await Promise.all(
                stocksData.map((stock) => updateStockPriceAndProfitLoss(stock))
            );

            setStocks(updatedStocks);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching stocks:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add a new stock
    const addStock = async (newStock) => {
        try {
            const response = await axios.post(`${API_URL}/`, newStock);
            const savedStock = response.data;

            const stockWithProfitLoss = await updateStockPriceAndProfitLoss(savedStock);
            setStocks((prevStocks) => [...prevStocks, stockWithProfitLoss]);
        } catch (err) {
            console.error("Error adding stock:", err.message);
        }
    };

    // Edit a stock
    const editStock = async (updatedStock) => {
        try {
            await axios.put(`${API_URL}/stocks/${updatedStock.ticker}`, updatedStock);
            const updatedStockWithProfitLoss = await updateStockPriceAndProfitLoss(updatedStock);

            setStocks((prevStocks) =>
                prevStocks.map((stock) =>
                    stock.ticker === updatedStock.ticker ? updatedStockWithProfitLoss : stock
                )
            );
        } catch (err) {
            console.error("Error editing stock:", err.message);
        }
    };

    // Delete a stock
    const deleteStock = async (ticker) => {
        try {
            await axios.delete(`${API_URL}/${ticker}`);
            setStocks((prevStocks) => prevStocks.filter((stock) => stock.ticker !== ticker));
        } catch (err) {
            console.error("Error deleting stock:", err.message);
        }
    };

    // Load stocks on component mount
    useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <StocksContext.Provider
            value={{
                stocks,
                loading,
                error,
                addStock,
                editStock,
                deleteStock,
                fetchStockPrice,
                
            }}
        >
            {children}
        </StocksContext.Provider>
    );
};

export default StocksProvider;
