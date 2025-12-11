const mongoose = require("mongoose");

// 1. Define the Staff Schema
const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["Manager", "Kitchen", "Waiter"], 
    default: "Waiter" 
  },
  createdAt: { type: Date, default: Date.now }
});

const ShopSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  logo: { type: String },
  cover: { type: String },
  
  shopname: String,
  address: String,
  contactphone: String,
  primarycolor: { type: String, default: "#000000" },
  secondarycolor: { type: String, default: "#ffffff" },

  // 2. Add the staff array here!
  staff: [StaffSchema] 

}, { timestamps: true });

module.exports = mongoose.model("Shop", ShopSchema);