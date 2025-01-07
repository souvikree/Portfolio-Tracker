import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import StocksProvider from "./context/StockContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<StocksProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
		</StocksProvider>
	</React.StrictMode>
);
