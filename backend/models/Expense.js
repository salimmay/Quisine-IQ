const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Link to Shop
  title: { type: String, required: true },  // e.g. "Tomatoes", "Chef Salary"
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ["Supplies", "Rent", "Utilities", "Salaries", "Maintenance", "Other"],
    default: "Supplies" 
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);