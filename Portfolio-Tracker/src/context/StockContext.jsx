/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
    const fetchStockPrices = async (ticker) => {
        try {
          const response = await axios.get(`${API_URL}/stocks/${ticker}`);
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

    // Fetch stocks from the backend and update their profit/loss
    const fetchStocks = async () => {
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
    const addStock = async (stockData) => {
        try {
            const response = await axios.post(`${API_URL}/`, stockData);
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
            // Send the updated stock to the backend API
            const response = await axios.put(`${API_URL}/${updatedStock._id}`, updatedStock);
            
            // Assuming the API returns the updated stock data (if not, use the updatedStock)
            const updatedStockWithProfitLoss = await updateStockPriceAndProfitLoss(updatedStock);
    
            // Update the stocks state with the modified stock data
            setStocks((prevStocks) =>
                prevStocks.map((stock) =>
                    stock._id === updatedStock._id ? updatedStockWithProfitLoss : stock
                )
            );
        } catch (err) {
            console.error("Error editing stock:", err.message);
        }
    };
    

    // Delete a stock
    // In StockContext or the relevant context file

    const deleteStock = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setStocks((prevStocks) => prevStocks.filter((stock) => stock._id !== id));  // Use _id
        } catch (err) {
            console.error("Error deleting stock:", err.message);
        }
      };
      
      const refreshStocks = async () => {
        try {
          const response = await axios.get(`${API_URL}/stocks`);
          const stocksData = response.data;
      
          const updatedStocks = await Promise.all(
            stocksData.map((stock) => updateStockPriceAndProfitLoss(stock))
          );
      
          setStocks(updatedStocks); // Update the stocks state
        } catch (err) {
          console.error("Error fetching stocks:", err.message);
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
                fetchStockPrices,
                fetchStocks,
                refreshStocks
            }}
        >
            {children}
        </StocksContext.Provider>
    );
};

export default StocksProvider;
