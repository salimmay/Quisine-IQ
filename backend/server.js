// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Middleware
const requestLogger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

// --- 1. Database Connection & Startup ---
// We wrap this in an async function to control the startup flow
const startServer = async () => {
  try {
    // Connect to DB first
    await connectDB();
    
    // --- 2. Middlewares ---
    app.use(cors({
  origin: "*", // Allow any device (Phone IP) to connect
  credentials: true
}));
    // Increased limit for initial large payload support, though we prefer cloud storage now
    app.use(express.json({ limit: '10mb' })); 
    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    // Request Logger
    app.use(requestLogger);

    // --- 3. Routes ---
    app.use("/auth", require("./routes/auth"));
    app.use("/admin", require("./routes/admin"));
    app.use("/shop", require("./routes/shop")); 

    // Health Check
    app.get("/", (req, res) => {
      res.status(200).json({ 
        status: "Online", 
        message: "Quisine-IQ API is running smoothly 🚀" 
      });
    });

    // Error Handler (Last Middleware)
    app.use(errorHandler);

    // --- 4. Start Listener ---
    app.listen(PORT, () => {
      console.log(`\n\n`);
      console.log(`    ██████╗ ██╗   ██╗██╗███████╗██╗███╗   ██╗███████╗`);
      console.log(`   ██╔═══██╗██║   ██║██║██╔════╝██║████╗  ██║██╔════╝`);
      console.log(`   ██║     ║██║   ██║██║███████╗██║██╔██╗ ██║█████╗  `);
      console.log(`   ██║▄▄ ██║██║   ██║██║╚════██║██║██║╚██╗██║██╔══╝  `);
      console.log(`   ╚██████╔╝╚██████╔╝██║███████║██║██║ ╚████║███████╗`);
      console.log(`    ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝`);
      console.log(`   --------------------------------------------------`);
      console.log(`   🚀  SERVER RUNNING   :  http://localhost:${PORT}`);
      console.log(`   📅  DATE             :  ${new Date().toLocaleString()}`);
      console.log(`   💽  DATABASE         :  Connected`);
      console.log(`   --------------------------------------------------\n`);
    });

  } catch (error) {
    console.error("❌  Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();