const mongoose = require("mongoose");

const ModifierSchema = new mongoose.Schema({
  name: String,
  price: Number,
  on: { type: Boolean, default: true }
});

const ItemSchema = new mongoose.Schema({
  name: String,
  img: { type: String },
  baseprice: Number,
  description: String,
  time: Number, 
  available: { type: Boolean, default: true },
  modifiers: [ModifierSchema]
});

const CategorySchema = new mongoose.Schema({
  name: String,
  items: [ItemSchema] 
});

const MenuSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "Shop" },
  categories: [CategorySchema]
});

module.exports = mongoose.model("Menu", MenuSchema);