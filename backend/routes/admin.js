const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/adminController");

// Configure Multer (Memory Storage for Cloudinary Streaming)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- SHOP SETTINGS ---
router.get('/info/:userId', adminController.getShopInfo);
router.put("/info/:userId", 
    upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), 
    adminController.updateShopInfo
);

// --- MENU CATEGORIES ---
router.get('/menu/:userId', adminController.getMenu);
router.post("/category", adminController.addCategory);
router.delete("/category/:id", adminController.deleteCategory);

// --- MENU ITEMS ---
router.post("/category/:categoryId/item", upload.single('image'), adminController.addItem);
router.put("/category/:categoryId/item/:itemId", upload.single('image'), adminController.updateItem);
router.delete("/category/:categoryId/item/:itemId", adminController.deleteItem);
router.patch("/category/:categoryId/item/:itemId/availability", adminController.toggleAvailability);

// --- ORDERS ---
router.get("/orders/:userId", adminController.getOrders);
router.patch("/order/:orderId/status", adminController.updateOrderStatus);
router.delete("/order/:orderId", adminController.deleteOrder);

// --- ANALYTICS ---
router.get("/stats/:userId", require("../controllers/statsController").getDashboardStats);
router.get("/expenses/:userId", require("../controllers/statsController").getExpenses);
router.post("/expense", require("../controllers/statsController").addExpense);

// ==========================================
// ---> THIS IS WHAT WAS MISSING <---
// ==========================================
router.get("/staff/:userId", adminController.getStaff);
router.post("/staff", adminController.addStaff);
router.delete("/staff/:userId/:staffId", adminController.deleteStaff);

module.exports = router;