const Order = require("../models/Order");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Get Dashboard Stats (Cards + Charts)
exports.getDashboardStats = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Calculate Totals (Revenue vs Expenses)
    // We get all time totals for simplicity, or you can filter by month
    const revenueTotal = await Order.aggregate([
      { $match: { userId: userId, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
    ]);

    const expenseTotal = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalRev = revenueTotal[0]?.total || 0;
    const totalExp = expenseTotal[0]?.total || 0;
    const totalOrders = revenueTotal[0]?.count || 0;

    // 2. Get Last 7 Days Revenue (For Line Chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      { 
        $match: { 
          userId: userId, 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 3. Expense Breakdown (For Pie Chart)
    const expenseByCategory = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } }
    ]);

    // 4. Top Selling Items (For List)
    // This is tricky because items are an array. We unwind them.
    const topItems = await Order.aggregate([
      { $match: { userId: userId, status: { $ne: 'cancelled' } } },
      { $unwind: "$items" },
      { 
        $group: { 
          _id: "$items.name", 
          count: { $sum: "$items.qty" }, 
          sales: { $sum: { $multiply: ["$items.qty", "$items.price"] } } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      summary: {
        revenue: totalRev,
        expenses: totalExp,
        profit: totalRev - totalExp,
        orders: totalOrders
      },
      chartData: dailyRevenue,
      expensesPie: expenseByCategory,
      topItems
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Stats Error" });
  }
};

// Add a new Expense
exports.addExpense = async (req, res) => {
  try {
    const { userId, title, amount, category, date } = req.body;
    const expense = new Expense({ userId, title, amount, category, date });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add expense" });
  }
};

// Get Recent Expenses List
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(20);
    res.json(expenses);
  } catch (err) {
    res.status(500).json(err);
  }
};