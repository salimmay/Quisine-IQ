const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const Shop = require('../models/Shop');
const Order = require('../models/Order');

// 1. GET PUBLIC MENU (The Customer View)
router.get('/menu/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    // Fetch the Shop Details (Name, Logo, Cover)
    const shop = await Shop.findOne({ userId: shopId }).select('-password -email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    // Fetch the Menu
    const menu = await Menu.findOne({ userId: shopId });
    
    // Return combined data
    res.json({ shop, menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. PLACE ORDER (Checkout)
router.post('/order', async (req, res) => {
  try {
    const { shopId, table, items, total, modifiers } = req.body;

    // Create the order
    const newOrder = new Order({
      userId: shopId,
      table: table,
      items: items, // Contains { name, qty, price, modifiers }
      total: total,
      status: 'pending' // Default status
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// 3. GET ORDER DETAILS (For Success Page)
router.get('/order/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if(!order) return res.status(404).json({ msg: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;