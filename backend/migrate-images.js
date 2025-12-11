require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Import Models
const Menu = require('./models/Menu');
const Shop = require('./models/Shop');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStream = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (err, result) => {
        if (result) resolve(result.secure_url);
        else reject(err);
      }
    );
    stream.end(buffer);
  });
};

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Connected to DB for Migration...");

    // --- 1. MIGRATE SHOPS (Logo & Cover) ---
    const shops = await Shop.find({});
    console.log(`🏪 Found ${shops.length} Shops. Checking for Buffers...`);

    for (const shop of shops) {
      let modified = false;

      // Check Logo (Old Buffer check relies on the field existing and being Binary)
      if (shop.logo && Buffer.isBuffer(shop.logo)) {
        console.log(`   Uploading Logo for: ${shop.shopname}`);
        const url = await uploadStream(shop.logo, 'quisine-shops');
        shop.logo = url; // Mongoose will now save this as String
        modified = true;
      }

      // Check Cover
      if (shop.cover && Buffer.isBuffer(shop.cover)) {
        console.log(`   Uploading Cover for: ${shop.shopname}`);
        const url = await uploadStream(shop.cover, 'quisine-shops');
        shop.cover = url;
        modified = true;
      }

      if (modified) await shop.save();
    }

    // --- 2. MIGRATE MENUS (Deep Nested Items) ---
    const menus = await Menu.find({});
    console.log(`📜 Found ${menus.length} Menus. Checking nested items...`);

    for (const menu of menus) {
      let menuModified = false;

      // Loop Categories
      for (const cat of menu.categories) {
        // Loop Items
        for (const item of cat.items) {
          // Check if 'img' is a Buffer
          if (item.img && Buffer.isBuffer(item.img)) {
            console.log(`   Processing Item: ${item.name}`);
            const url = await uploadStream(item.img, 'quisine-menu');
            item.img = url; // Replace Buffer with URL string
            menuModified = true;
          }
        }
      }

      if (menuModified) {
        await menu.save();
        console.log(`   ✅ Saved Menu for User: ${menu.userId}`);
      }
    }

    console.log("🎉 MIGRATION COMPLETE");
    process.exit();

  } catch (err) {
    console.error("❌ Migration Failed:", err);
    process.exit(1);
  }
};

runMigration();