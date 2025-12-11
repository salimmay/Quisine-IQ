const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  table: Number,
  items: [], 
  total: Number,
  status: { type: String, default: "pending" }, 
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);