const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stockName: { 
        type: String, 
        required: true 
    },
    ticker: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    buyPrice: { 
        type: Number, 
        required: true 
    },
});

module.exports = mongoose.model('Stock', stockSchema);
