require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// Import Models
const Shop = require("../models/Shop");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Expense = require("../models/Expense");

// --- STABLE IMAGES (Unsplash) ---
const IMAGES = {
  burger: {
    logo: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&q=80",
    cover: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
    item1: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", // Burger
    item2: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80", // Coffee
    item3: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&q=80", // Meat Salad
  },
  sushi: {
    logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80",
    cover: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&q=80",
    item1: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80", // Nigiri
    item2: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=500&q=80", // Rolls
  },
  tunisian: {
    logo: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=200&q=80", // Pattern
    cover: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=1200&q=80", // Couscous/Veg
    item1: "https://plus.unsplash.com/premium_photo-1664472637341-3ec829d1f4df?w=500&q=80", // Couscous
    item2: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80", // Brik
    item3: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=500&q=80", // Ojja
  }
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🇹🇳 Connecting to Tunisian Database...");

    // 1. CLEAR OLD DATA
    await Shop.deleteMany({});
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Expense.deleteMany({});
    console.log("🧹 Cleaned old data.");

    // 2. SETUP USER AUTH
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // --- SHOP 1: BUN & BEEF (Lac 2) ---
    const burgerId = uuidv4();
    await Shop.create({
      userId: burgerId,
      username: "burgeradmin",
      email: "admin@bunandbeef.tn",
      password: hashedPassword,
      shopname: "Bun & Beef",
      address: "Rue du Lac Lochness, Les Berges du Lac 2, Tunis",
      contactphone: "+216 20 123 456",
      primarycolor: "#ea580c", // Orange
      secondarycolor: "#1e293b", // Slate
      logo: IMAGES.burger.logo,
      cover: IMAGES.burger.cover,
      staff: [
        { name: "Ahmed", pin: "1234", role: "Manager" },
        { name: "Sarah", pin: "0000", role: "Waiter" }, // CHANGED from 'Waitress' to 'Waiter'
        { name: "Chef Karim", pin: "1111", role: "Kitchen" }
      ]
    });

    // --- SHOP 2: ORIGAMI SUSHI (La Marsa) ---
    const sushiId = uuidv4();
    await Shop.create({
      userId: sushiId,
      username: "sushiadmin",
      email: "chef@origami.tn",
      password: hashedPassword,
      shopname: "Origami Sushi Bar",
      address: "Avenue Habib Bourguiba, La Marsa",
      contactphone: "+216 55 987 654",
      primarycolor: "#be123c", // Rose
      secondarycolor: "#000000", // Black
      logo: IMAGES.sushi.logo,
      cover: IMAGES.sushi.cover,
      staff: [
        { name: "Myriam", pin: "9999", role: "Manager" },
        { name: "Youssef", pin: "5555", role: "Waiter" }
      ]
    });

    // --- SHOP 3: LE SFAXIEN (Traditional) ---
    const tunisianId = uuidv4();
    await Shop.create({
      userId: tunisianId,
      username: "tunisianadmin",
      email: "contact@lesfaxien.tn",
      password: hashedPassword,
      shopname: "Le Sfaxien Authentique",
      address: "Bab Bhar, Medina, Tunis",
      contactphone: "+216 71 111 222",
      primarycolor: "#059669", // Emerald Green
      secondarycolor: "#fcd34d", // Gold
      logo: IMAGES.tunisian.logo,
      cover: IMAGES.tunisian.cover,
      staff: [
        { name: "Hedi", pin: "1010", role: "Manager" }
      ]
    });

    console.log("🏗️  Created 3 Shops with Staff");

    // 3. MENUS
    
    // Burger Menu
    await Menu.create({
      userId: burgerId,
      categories: [
        {
          name: "Gourmet Burgers",
          items: [
            {
              name: "Le Tunisien",
              baseprice: 22.000,
              description: "Grilled patty, harissa mayo, grilled peppers, cheddar.",
              time: 15,
              img: IMAGES.burger.item1,
              modifiers: [{ name: "Extra Cheese", price: 2.5 }, { name: "Double Patty", price: 6.0 }]
            },
            {
              name: "Truffle Smash",
              baseprice: 28.500,
              description: "Smashed beef, truffle oil, caramelized onions.",
              time: 15,
              img: IMAGES.burger.item3,
              modifiers: []
            }
          ]
        },
        {
          name: "Boissons",
          items: [
            { name: "Citronnade", baseprice: 6.000, time: 5, img: IMAGES.burger.item2 },
            { name: "Coca Cola", baseprice: 3.500, time: 2, img: IMAGES.burger.item2 }
          ]
        }
      ]
    });

    // Tunisian Menu
    await Menu.create({
      userId: tunisianId,
      categories: [
        {
          name: "Plats Traditionnels",
          items: [
            {
              name: "Couscous Royal",
              baseprice: 35.000,
              description: "Lamb, chicken, merguez, and seasonal vegetables.",
              time: 30,
              img: IMAGES.tunisian.item1,
              modifiers: [{ name: "Extra Merguez", price: 4.0 }]
            },
            {
              name: "Ojja Merguez",
              baseprice: 18.000,
              description: "Spicy tomato stew with fresh merguez and eggs.",
              time: 20,
              img: IMAGES.tunisian.item3,
            }
          ]
        },
        {
          name: "Entrées",
          items: [
            {
              name: "Brik à l'oeuf",
              baseprice: 4.500,
              description: "Crispy pastry with egg, tuna, and parsley.",
              time: 10,
              img: IMAGES.tunisian.item2,
              modifiers: [{ name: "Extra Cheese", price: 1.0 }]
            }
          ]
        }
      ]
    });

    console.log("📜 Created Menus (TND Currency)");

    // 4. GENERATE HISTORICAL ORDERS & EXPENSES
    
    const generateHistory = async (shopId) => {
      const statuses = ["completed", "completed", "completed", "cancelled"];
      const expenseTypes = ["Supplies", "Rent", "Salaries", "Utilities"];
      
      // Go back 10 days
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i); // Subtract days

        // Generate 3-8 orders per day
        const ordersCount = Math.floor(Math.random() * 5) + 3;
        
        for (let j = 0; j < ordersCount; j++) {
            const amount = (Math.random() * 50) + 20; 
            await Order.create({
                userId: shopId,
                table: Math.floor(Math.random() * 15) + 1,
                items: [{ name: "Random Dish", qty: 1, price: amount }],
                total: amount,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: date
            });
        }

        // Add 1 Expense every few days
        if (i % 2 === 0) {
            await Expense.create({
                userId: shopId,
                title: i % 4 === 0 ? "Vegetable Supply" : "Daily Maintenance",
                amount: (Math.random() * 100) + 50,
                category: expenseTypes[Math.floor(Math.random() * expenseTypes.length)],
                date: date
            });
        }
      }
    };

    console.log("📊 Generating Analytics Data...");
    await generateHistory(burgerId);
    await generateHistory(tunisianId);

    console.log("\n✅ SEED COMPLETE!");
    console.log("------------------------------------------------");
    console.log("🔑 LOGIN CREDENTIALS:");
    console.log("1. Bun & Beef: admin@bunandbeef.tn / password123");
    console.log("   Staff: Ahmed (1234), Sarah (0000), Karim (1111)");
    console.log("------------------------------------------------");

    process.exit();
  } catch (err) {
    console.error("❌ Seed Failed:", err);
    process.exit(1);
  }
};

seedDB();