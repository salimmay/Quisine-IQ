const Shop = require("../models/Shop");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const cloudinary = require('cloudinary').v2;

// --- Helper: Upload Stream to Cloudinary ---
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// ==========================================
// SHOP INFO
// ==========================================

exports.getShopInfo = async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.params.userId }).select("-password");
    if (!shop) return res.status(404).json({ msg: "Shop not found" });
    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateShopInfo = async (req, res) => {
  try {
    const { shopname, address, contactphone, primarycolor, secondarycolor } = req.body;
    let updateData = { shopname, address, contactphone, primarycolor, secondarycolor };

    // Handle Cloudinary Uploads if files exist
    if (req.files) {
      if (req.files.logo) {
        const logoUrl = await streamUpload(req.files.logo[0].buffer, 'quisine-shops');
        updateData.logo = logoUrl;
      }
      if (req.files.cover) {
        const coverUrl = await streamUpload(req.files.cover[0].buffer, 'quisine-shops');
        updateData.cover = coverUrl;
      }
    }

    const shop = await Shop.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
};

// ==========================================
// MENU MANAGEMENT
// ==========================================

exports.getMenu = async (req, res) => {
  try {
    // Find menu or create empty one if not exists
    let menu = await Menu.findOne({ userId: req.params.userId });
    if (!menu) {
      menu = new Menu({ userId: req.params.userId, categories: [] });
      await menu.save();
    }
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { userId, name, description } = req.body;
    const menu = await Menu.findOne({ userId });

    menu.categories.push({ name, description, items: [] });
    await menu.save();

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Pull (remove) category by _id
    await Menu.updateOne(
      { "categories._id": req.params.id },
      { $pull: { categories: { _id: req.params.id } } }
    );
    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

// ==========================================
// ITEM MANAGEMENT
// ==========================================

exports.addItem = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, baseprice, description, time } = req.body;
    let imageUrl = "";

    // Upload Image
    if (req.file) {
      imageUrl = await streamUpload(req.file.buffer, 'quisine-menu');
    }

    const newItem = {
      name,
      baseprice: Number(baseprice),
      description,
      time: Number(time),
      img: imageUrl, // Saving URL string
      available: true
    };

    await Menu.updateOne(
      { "categories._id": categoryId },
      { $push: { "categories.$.items": newItem } }
    );

    res.json({ msg: "Item added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add item" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    const { name, baseprice, description, time } = req.body;
    
    // Build update object dynamically
    let updateFields = {
      "categories.$[cat].items.$[item].name": name,
      "categories.$[cat].items.$[item].baseprice": Number(baseprice),
      "categories.$[cat].items.$[item].description": description,
      "categories.$[cat].items.$[item].time": Number(time),
    };

    // Only update image if a new one was uploaded
    if (req.file) {
      const imageUrl = await streamUpload(req.file.buffer, 'quisine-menu');
      updateFields["categories.$[cat].items.$[item].img"] = imageUrl;
    }

    await Menu.updateOne(
      { "categories._id": categoryId },
      { $set: updateFields },
      { 
        arrayFilters: [{ "cat._id": categoryId }, { "item._id": itemId }] 
      }
    );

    res.json({ msg: "Item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    await Menu.updateOne(
      { "categories._id": categoryId },
      { $pull: { "categories.$.items": { _id: itemId } } }
    );
    res.json({ msg: "Item deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    const { available } = req.body;

    await Menu.updateOne(
      { "categories._id": categoryId },
      { $set: { "categories.$[cat].items.$[item].available": available } },
      { arrayFilters: [{ "cat._id": categoryId }, { "item._id": itemId }] }
    );
    res.json({ msg: "Availability updated" });
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

// ==========================================
// ORDERS & QR
// ==========================================

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.json({ msg: "Order deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.generateQRCodes = async (req, res) => {
  // Legacy support - Front-end now handles this via SVG
  res.json({ msg: "Please use frontend generation" });
};


// ==========================================
// STAFF MANAGEMENT
// ==========================================

exports.addStaff = async (req, res) => {
  try {
    const { name, pin, role, userId } = req.body;
    const shop = await Shop.findOne({ userId });
    
    if (!shop) return res.status(404).json({ msg: "Shop not found" });

    // Check if PIN is unique for this shop
    const pinExists = shop.staff.find(s => s.pin === pin);
    if(pinExists) return res.status(400).json({ msg: "PIN already in use" });

    shop.staff.push({ name, pin, role });
    await shop.save();
    
    res.json(shop.staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.params.userId });
    if (!shop) return res.json([]); 
    res.json(shop.staff || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { userId, staffId } = req.params;
    await Shop.updateOne(
      { userId },
      { $pull: { staff: { _id: staffId } } }
    );
    res.json({ msg: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};