👨‍🍳 Quisine-IQ
Quisine-IQ is a modern, full-stack SaaS solution designed to digitize restaurant operations. It provides a seamless QR-code ordering experience for customers and a powerful management dashboard for restaurant owners, chefs, and staff.
Built with the MERN Stack and optimized for performance with Vite and React Query.


🚀 Features
📱 For Customers (Public Menu)
QR Code Access: Scan to view the menu instantly (No app download required).
Smart Menu: Filter by category, view detailed descriptions and prices (TND).
Customization: Add modifiers to items (e.g., "Extra Cheese", "No Onions").
Cart & Checkout: Review orders and submit them directly to the kitchen.
Live Status: Track order progress (Pending → Preparing → Ready).
🖥️ For Restaurant Managers (Admin Dashboard)
Analytics Dashboard: Real-time charts for Revenue, Expenses, and Net Profit.
Menu Management: Create categories, upload images (Cloudinary), and toggle item availability instantly.
Kitchen Display System (KDS): Real-time Kanban board for incoming orders with auto-refresh.
Staff Management: Create accounts for Waiters, Kitchen Staff, and Managers with PIN login.
Expense Tracking: Record supplies, rent, and other costs to calculate true profit.
QR Generator: Generate and print custom QR codes for specific tables.
Receipt Printing: Thermal printer-friendly order tickets.
🛠️ Tech Stack
Frontend
Framework: React 18 + Vite
Styling: Tailwind CSS + Shadcn/UI
State Management: TanStack Query (React Query)
Charts: Recharts
Animations: Framer Motion
Icons: Lucide React
Backend
Runtime: Node.js + Express
Database: MongoDB (Mongoose)
Storage: Cloudinary (Image Uploads)
Authentication: JWT (JSON Web Tokens)
Security: Bcrypt, CORS, Helmet
⚙️ Installation & Setup
1. Clone the Repository
code
Bash
git clone https://github.com/yourusername/quisine-iq.git
cd quisine-iq
2. Backend Setup
Navigate to the backend folder and install dependencies:
code
Bash
cd backend
npm install
Create a .env file in the backend/ folder:
code
Env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Seed the Database (Important):
Run this script to create the initial Shops, Menu Items, and Staff accounts.
code
Bash
npm run seed
Start the Server:
code
Bash
npm start
3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
code
Bash
cd frontend
npm install
Start the Development Server:
code
Bash
npm run dev
The app should now be running at http://localhost:5173.
🔑 Default Login Credentials
After running npm run seed, use these accounts to log in:
Shop 1: Bun & Beef (Burger Joint)
Email: admin@bunandbeef.tn
Password: password123
Shop 2: Origami (Sushi Bar)
Email: chef@origami.tn
Password: password123
Shop 3: Le Sfaxien (Traditional)
Email: contact@lesfaxien.tn
Password: password123
📂 Project Structure
code
Bash
quisine-iq/
├── backend/
│   ├── config/         # DB Connection
│   ├── controllers/    # Logic for Admin, Shop, Stats
│   ├── models/         # Mongoose Schemas (Shop, Menu, Order, Expense)
│   ├── routes/         # API Endpoints
│   ├── scripts/        # Seeding scripts
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI (Shadcn)
    │   ├── context/    # Auth Context
    │   ├── hooks/      # Custom React Hooks (useAuth, useCart)
    │   ├── lib/        # API Utilities & Helpers
    │   ├── pages/      # Full Pages (Login, Menu, Dashboard)
    │   │   └── Manage/ # Admin Sub-pages (Orders, Team, Stats)
    │   └── App.jsx     # Routing Logic
🌍 Localization
This project is customized for the Tunisian Market:
Currency: TND (Dinar Tunisien) displayed with 3 decimal places (e.g., 22.500 DT).
Timezone: Formatting adapted for local time.
🛡️ License
This project is proprietary. Created by [Salim May].