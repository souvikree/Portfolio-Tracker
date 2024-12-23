const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());


connectDB();

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes); 

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
