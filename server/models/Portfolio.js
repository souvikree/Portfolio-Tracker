const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    stocks: [
        { ticker: String, 
            price: Number, 
            quantity: Number 
        }
    ],
    totalValue: { 
        type: Number,
         default: 0 
        }, // Store the total value here
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
