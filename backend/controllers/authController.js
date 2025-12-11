const Shop = require("../models/Shop");
const Menu = require("../models/Menu");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid'); // Install uuid or use Math.random like before

// Helper to generate random ID
const makeId = () => Math.random().toString(36).substring(2, 15);

exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // 1. Check if user exists
    const existingShop = await Shop.findOne({ email });
    if (existingShop) return res.status(400).json({ msg: "Email already exists" });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Shop
    const userId = makeId();
    const newShop = new Shop({
      userId,
      username,
      email,
      password: hashedPassword,
      contactphone: phone
    });
    await newShop.save();

    // 4. Create Empty Menu for Shop
    const newMenu = new Menu({ userId, categories: [] });
    await newMenu.save();

    res.status(201).json({ msg: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find Shop
    const shop = await Shop.findOne({ email });
    if (!shop) return res.status(400).json({ msg: "Invalid credentials" });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 3. Return Token/User Info
    res.json({
      userId: shop.userId,
      email: shop.email,
      token: "demo-token-replace-with-jwt-later" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};