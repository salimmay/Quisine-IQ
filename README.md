# 🍽️ Quisine-IQ

**A Modern Restaurant Management System with QR Code-Based Table Ordering**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Overview

Quisine-IQ is a comprehensive, full-stack restaurant management solution that modernizes the dining experience through contactless QR code ordering. The system empowers restaurant owners with a powerful admin dashboard to manage their menus, track orders, and customize their brand, while providing customers with a seamless, mobile-friendly ordering interface directly from their table.

### Key Highlights

- 🎯 **Dual Interface System**: Separate admin panel and customer-facing menu
- 📱 **QR Code Ordering**: Contactless table ordering via scannable QR codes
- 🎨 **Brand Customization**: Personalize colors, logos, and shop appearance
- 📊 **Real-time Order Management**: Track and manage orders as they come in
- 🍔 **Flexible Menu System**: Hierarchical organization with categories, items, and modifiers
- 🖼️ **Image Support**: Upload logos, covers, and menu item photos
- ⚡ **Modern Tech Stack**: React + Vite frontend, Express.js + MongoDB backend

## 🎯 Project Utility

### For Restaurant Owners

- **Streamline Operations**: Reduce wait staff workload with direct table ordering
- **Increase Efficiency**: Customers order directly, reducing order errors
- **Enhance Branding**: Customize the look and feel to match your restaurant's identity
- **Track Orders**: Real-time dashboard to monitor all incoming orders
- **Menu Flexibility**: Easily update menu items, prices, and availability
- **Generate QR Codes**: Create unique QR codes for each table in your restaurant

### For Customers

- **Contactless Ordering**: Scan QR code at table to view menu and order
- **Visual Menu**: Browse menu items with photos and descriptions
- **Customization**: Add modifiers and customize orders to preferences
- **Instant Ordering**: Place orders directly without waiting for staff
- **Order Confirmation**: Receive immediate confirmation of orders

### For Developers

- **Modern Architecture**: Clean separation of frontend and backend
- **Scalable Design**: MongoDB for flexible data storage
- **RESTful API**: Well-structured API endpoints
- **Component-Based**: Reusable React components
- **Easy Deployment**: Simple setup and configuration

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Quisine-IQ                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐            ┌──────▼──────┐
         │   Frontend  │            │   Backend   │
         │  (React +   │◄──────────►│ (Express.js │
         │    Vite)    │    REST    │  + MongoDB) │
         └─────────────┘    API     └─────────────┘
                │                           │
        ┌───────┴────────┐         ┌────────┴────────┐
        │                │         │                 │
   ┌────▼─────┐   ┌─────▼────┐   ┌▼──────┐   ┌─────▼─────┐
   │  Admin   │   │ Customer │   │ Routes│   │  MongoDB  │
   │Dashboard │   │   Menu   │   │ Layer │   │ Database  │
   └──────────┘   └──────────┘   └───────┘   └───────────┘
```

### Technology Stack

#### Frontend

- **React 18.2.0** - Modern UI library
- **Vite 5.2.0** - Fast build tool and dev server
- **React Router DOM 6.23.0** - Client-side routing
- **Material-UI 5.15.18** - Component library
- **Tailwind CSS 3.4.3** - Utility-first CSS framework
- **React Icons 5.2.0** - Icon library

#### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 7.5.0** - MongoDB object modeling
- **Passport 0.6.0** - Authentication middleware
- **QRCode 1.5.3** - QR code generation

## 📁 Project Structure

```
Quisine-IQ/
├── frontend/                    # Frontend application
│   └── admin/
│       └── nassimapp/          # React + Vite app
│           ├── src/
│           │   ├── components/ # Reusable components
│           │   ├── pages/      # Page components
│           │   ├── hooks/      # Custom React hooks
│           │   ├── services/   # API service layer
│           │   ├── styles/     # CSS files
│           │   └── App.jsx     # Main app component
│           ├── package.json
│           └── vite.config.js
│
├── backend/                     # Backend API server
│   ├── routes/                 # API route handlers
│   │   ├── admin.js           # Admin endpoints
│   │   ├── shop.js            # Shop/customer endpoints
│   │   └── auth.js            # Authentication
│   ├── database.js            # MongoDB schemas
│   ├── server.js              # Express server
│   └── package.json
│
├── start.bat                   # Windows startup script
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/Quisine-IQ.git
cd Quisine-IQ
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend/admin/nassimapp
npm install
```

### Configuration

#### Backend Configuration

1. **Database Connection**: Edit `backend/database.js`

```javascript
mongoose.connect("mongodb://127.0.0.1/nassimpfe");
```

Update the connection string to match your MongoDB instance.

2. **Server Port**: Default is 8080 (in `backend/server.js`)

3. **QR Code URL**: Update in `backend/routes/admin.js`

```javascript
const clientIp = "http://your-frontend-url:5000";
```

#### Frontend Configuration

1. **API Proxy**: The frontend is configured to proxy API requests to `http://localhost:8080`
   - See `frontend/admin/nassimapp/package.json` for proxy settings

### Running the Application

#### Option 1: Manual Start

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Backend runs on `http://localhost:8080`

**Terminal 2 - Frontend:**

```bash
cd frontend/admin/nassimapp
npm run dev
```

Frontend runs on `http://localhost:5173`

#### Option 2: Windows Batch Script

```bash
start.bat
```

This will start both frontend and backend servers.

### First-Time Setup

1. **Access the Application**: Navigate to `http://localhost:5173`
2. **Sign Up**: Create a restaurant account at `/signup`
3. **Configure Shop**: Add shop details, logo, and branding
4. **Create Menu**: Add categories and menu items
5. **Generate QR Codes**: Create QR codes for your tables
6. **Print QR Codes**: Place them on tables for customer access

## 📱 Usage Guide

### Admin Dashboard

1. **Login**: Access admin panel at `http://localhost:5173`
2. **Manage Shop Info** (`/manage/info`):
   - Upload logo and cover images
   - Set shop name, address, contact details
   - Configure brand colors
3. **Manage Menu** (`/manage/menu`):
   - Create categories (Appetizers, Main Courses, etc.)
   - Add items with photos, descriptions, prices
   - Set preparation times and availability
4. **Manage Modifiers**:
   - Create customization options (Extra Cheese, No Onions, etc.)
   - Set modifier prices
   - Assign to menu items
5. **View Orders** (`/manage/orders`):
   - See all incoming orders
   - Track table numbers
   - View order details and totals
6. **Generate QR Codes** (`/manage/qrcodes`):
   - Specify number of tables
   - Download QR codes
   - Print and place on tables

### Customer Experience

1. **Scan QR Code**: Customer scans code at their table
2. **View Menu**: Browse categories and items with photos
3. **Select Items**: Add items to order
4. **Customize**: Choose modifiers for each item
5. **Checkout**: Review order and confirm
6. **Confirmation**: Receive order confirmation with order ID

## 🔌 API Documentation

### Base URL

```
http://localhost:8080
```

### Admin Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/admin/login`      | Admin authentication |
| GET    | `/admin/info/:id`   | Get shop information |
| PATCH  | `/admin/info/:id`   | Update shop details  |
| GET    | `/admin/menu/:id`   | Get full menu        |
| POST   | `/admin/category`   | Create category      |
| PATCH  | `/admin/category`   | Add item to category |
| POST   | `/admin/modifier`   | Create modifier      |
| GET    | `/admin/orders/:id` | Get all orders       |
| POST   | `/admin/qrcodes`    | Generate QR codes    |

### Shop Endpoints

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | `/shop/menu/:id`  | Get menu for customers |
| GET    | `/shop/item/:id`  | Get item details       |
| POST   | `/shop/checkout`  | Create new order       |
| GET    | `/shop/order/:id` | Get order details      |

For detailed API documentation, see [Backend README](backend/README.md).

## 🗄️ Database Schema

### Collections

- **shops** - Restaurant profiles and settings
- **menus** - Menu structures with category references
- **categories** - Menu categories
- **items** - Individual menu items
- **modifiers** - Customization options
- **orders** - Customer orders

### Relationships

```
Shop
 └── Menu
      └── Categories []
           └── Items []
                └── Modifiers []

Shop
 └── Orders []
      └── Items []
           └── Modifiers []
```

For detailed schema documentation, see [Backend README](backend/README.md).

## 🎨 Customization

### Branding

- Upload custom logo and cover images
- Set primary and secondary brand colors
- Customize shop name and description

### Menu

- Organize items into custom categories
- Add photos to menu items
- Set custom prices and preparation times
- Create unlimited modifiers

### QR Codes

- Generate codes for any number of tables
- Codes link to table-specific ordering pages
- Customize QR code destination URL

## 🔐 Security

- JWT-based authentication for admin access
- Password hashing with Passport.js
- CORS configuration for cross-origin requests
- Input validation on all endpoints
- Secure file upload handling

## 🚧 Future Enhancements

- [ ] Real-time order notifications via WebSockets
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Email notifications for orders
- [ ] Order status tracking (Preparing, Ready, Delivered)
- [ ] Customer feedback and ratings
- [ ] Inventory management
- [ ] Staff management and permissions
- [ ] Mobile apps (iOS/Android)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code structure and naming conventions
- Write clean, commented code
- Test all changes before submitting
- Update documentation for new features
- Follow React best practices for frontend
- Use async/await for backend async operations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Backend won't start

- Ensure MongoDB is running
- Check port 8080 is not in use
- Verify database connection string

### Frontend won't connect to backend

- Confirm backend is running on port 8080
- Check proxy configuration in `package.json`
- Verify CORS settings in backend

### QR codes not working

- Update `clientIp` in `backend/routes/admin.js`
- Ensure frontend is accessible from customer devices
- Check network connectivity

### Images not uploading

- Verify file size is under 10MB
- Check file format (JPEG, PNG supported)
- Ensure proper encoding (binary/base64)

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact the development team
- Check documentation in `/frontend/README.md` and `/backend/README.md`

## 🙏 Acknowledgments

- Built with React, Express.js, and MongoDB
- UI components from Material-UI
- Styling with Tailwind CSS
- QR code generation with qrcode library
- Authentication with Passport.js

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: 2025

---

**Made with ❤️ for the restaurant industry**

For detailed component documentation, see:

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
