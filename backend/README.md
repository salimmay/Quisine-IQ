# Quisine-IQ Backend

## 📋 Overview

The Quisine-IQ backend is a RESTful API server built with Express.js and MongoDB. It provides comprehensive backend services for restaurant management, including menu organization, order processing, shop customization, and QR code generation for table-based ordering systems.

## 🎯 Purpose & Utility

This backend application serves as the core data and business logic layer for the Quisine-IQ restaurant management system:

1. **Restaurant Management**: Handle shop profiles, branding, and configuration
2. **Menu System**: Organize menus with categories, items, and customizable modifiers
3. **Order Processing**: Track and manage customer orders from multiple tables
4. **Authentication**: Secure admin access and user management
5. **QR Code Generation**: Create table-specific QR codes for contactless ordering
6. **File Handling**: Process and store images (logos, covers, menu item photos)

## 🛠️ Technology Stack

### Core Framework

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework for Node.js
- **Nodemon** - Development tool for auto-restarting the server

### Database

- **MongoDB** - NoSQL document database
- **Mongoose 7.5.0** - Elegant MongoDB object modeling for Node.js
  - Schema definition and validation
  - Model relationships and population
  - Query building and execution

### Middleware & Utilities

- **CORS** - Cross-Origin Resource Sharing support
- **body-parser** - Request body parsing middleware
  - JSON parsing (10MB limit)
  - URL-encoded data parsing
  - Raw binary data handling
- **cookie-parser 1.4.6** - Cookie parsing middleware
- **express-fileupload 1.5.0** - File upload handling
- **express-upload 0.1.0** - Additional upload utilities

### Authentication & Security

- **Passport 0.6.0** - Authentication middleware
- **passport-local 1.0.0** - Local username/password strategy
- **express-jwt 8.4.1** - JWT authentication middleware

### Additional Features

- **qrcode 1.5.3** - QR code generation library

## 📁 Project Structure

```
backend/
├── routes/                      # API route handlers
│   ├── admin.js                # Admin-specific endpoints
│   ├── auth.js                 # Authentication endpoints
│   ├── shop.js                 # Shop/customer endpoints
│   └── owner.js                # Owner-specific endpoints
├── database.js                  # MongoDB connection and schemas
├── server.js                    # Express server configuration
├── package.json                 # Dependencies and scripts
└── package-lock.json           # Locked dependency versions
```

## 🗄️ Database Schema

### Shop Schema

Stores restaurant/shop information and configuration.

```javascript
{
  userId: String (required),      // Unique shop identifier
  logo: Buffer,                   // Shop logo image
  cover: Buffer,                  // Cover/banner image
  shopname: String,               // Restaurant name
  username: String,               // Admin username
  email: String,                  // Shop email
  password: String,               // Hashed password
  address: String,                // Physical address
  firstname: String,              // Owner first name
  lastname: String,               // Owner last name
  contactemail: String,           // Contact email
  contactphone: String,           // Contact phone
  primarycolor: String,           // Brand primary color
  secondarycolor: String,         // Brand secondary color
  menu: MenuSchema,               // Embedded menu
  orders: [OrderSchema]           // Order history
}
```

### Menu Schema

Organizes menu structure with category references.

```javascript
{
  userId: String,                 // Shop identifier
  categories: [ObjectId]          // References to Category documents
}
```

### Category Schema

Groups menu items by category.

```javascript
{
  name: String,                   // Category name (e.g., "Appetizers")
  items: [ObjectId]               // References to Item documents
}
```

### Item Schema

Individual menu items with customization options.

```javascript
{
  img: Buffer,                    // Item image
  name: String,                   // Item name
  baseprice: Number,              // Base price
  description: String,            // Item description
  time: Number,                   // Preparation time (minutes)
  available: Boolean,             // Availability status (default: true)
  modifiers: [ModifierSchema]     // Available customizations
}
```

### Modifier Schema

Customization options for menu items.

```javascript
{
  userId: String,                 // Shop identifier
  name: String,                   // Modifier name (e.g., "Extra Cheese")
  price: Number,                  // Additional price
  on: Boolean                     // Active/inactive status
}
```

### Order Schema

Customer orders from tables.

```javascript
{
  userId: String,                 // Shop identifier
  table: Number,                  // Table number
  items: [Object],                // Ordered items with modifiers
  total: Number                   // Order total amount
}
```

## 🔌 API Endpoints

### Admin Routes (`/admin`)

#### Authentication

- **POST** `/admin/login` - Admin login
  - Returns JWT token

#### Shop Management

- **GET** `/admin/info/:id` - Get shop information
- **PATCH** `/admin/info/:id` - Update shop information
  - Handles logo/cover image uploads (binary data)

#### Menu Management

- **GET** `/admin/menu/:id` - Get full menu with categories and items
- **POST** `/admin/category` - Create new category
- **DELETE** `/admin/category/:id` - Delete category
- **PATCH** `/admin/category` - Add item to category
- **PATCH** `/admin/item` - Update item details
- **POST** `/admin/deleteitem` - Remove item from category
- **PATCH** `/admin/available/:id` - Toggle item availability

#### Modifier Management

- **GET** `/admin/modifiers/:id` - Get all modifiers for shop
- **POST** `/admin/modifier` - Create new modifier
- **DELETE** `/admin/modifier/:id` - Delete modifier

#### Order Management

- **GET** `/admin/orders/:id` - Get all orders for shop
- **DELETE** `/admin/order/:id` - Delete order

#### QR Code Generation

- **POST** `/admin/qrcodes` - Generate QR codes for tables
  - Request: `{ userId, tablecount }`
  - Returns: Array of QR code data URLs

### Shop Routes (`/shop`)

#### Menu Access

- **GET** `/shop/menu/:id` - Get menu and shop info for customers
- **GET** `/shop/item/:id` - Get specific item details
- **GET** `/shop/modifiers/:id` - Get modifiers for item

#### Order Processing

- **POST** `/shop/checkout` - Create new order
  - Request: `{ userId, table, list }`
  - Returns: Created order with ID
- **GET** `/shop/order/:id` - Get order details
- **POST** `/shop/total` - Calculate order total

### Auth Routes (`/auth`)

- Authentication and authorization endpoints
- User registration and login

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB (local or remote instance)
- npm or yarn package manager

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

### Configuration

1. **Database Connection**: Update MongoDB connection string in `database.js`:

```javascript
mongoose.connect("mongodb://127.0.0.1/nassimpfe");
```

2. **Port Configuration**: Default port is 8080 (configured in `server.js`)

3. **QR Code URL**: Update client IP in `routes/admin.js` for QR code generation:

```javascript
const clientIp = "http://192.168.43.39:5000";
```

### Development

Run the server with auto-restart on file changes:

```bash
npm start
```

The server will start on `http://localhost:8080`

### Testing

Test the server connection:

```bash
curl http://localhost:8080/test
```

Expected response: `"DOG"`

## 🔐 Authentication Flow

1. Admin logs in via `/admin/login`
2. Server returns JWT token
3. Token included in subsequent requests
4. `express-jwt` middleware validates tokens
5. Protected routes check authentication status

## 📤 File Upload Handling

Images are stored as Buffer data in MongoDB:

```javascript
// Converting base64/binary to Buffer
shop.logo = Buffer.from(shop.logo, "binary");
shop.cover = Buffer.from(shop.cover, "binary");
```

Supported file types:

- Shop logos
- Cover images
- Menu item photos

## 🔄 Data Population

Mongoose population is used to resolve references:

```javascript
// Populate categories and their items
Menu.findOne({ userId }).populate({
  path: "categories",
  populate: { path: "items" },
});
```

This returns fully nested menu structures with all data.

## 🎯 Key Features

### QR Code Generation

- Generates unique QR codes for each table
- QR codes link to: `/menu/:shopid/:table`
- Enables contactless ordering experience

### Order Calculation

- Automatic total calculation based on items and modifiers
- Modifier pricing (add-ons, customizations)
- Real-time price updates

### Menu Organization

- Hierarchical structure: Menu → Categories → Items
- Flexible modifier system
- Item availability toggling

### Image Management

- Binary storage in MongoDB
- Efficient image retrieval
- Support for logos, covers, and item images

## 🛡️ Middleware Stack

```javascript
app.use(express.static(__dirname)); // Static file serving
app.use(express.urlencoded({ extended: false })); // URL-encoded parsing
app.use(bodyParser.json({ limit: "10mb" })); // JSON parsing (10MB limit)
app.use(cors()); // CORS support
app.use(fileuploader()); // File upload handling
```

## 📊 Database Connection

Connection established on server start:

```javascript
mongoose
  .connect("mongodb://127.0.0.1/nassimpfe")
  .then(() => console.log("CONNECTED to localhost:8080"))
  .catch((err) => console.log(err));
```

Database name: `nassimpfe`

## 🔧 Development Tools

- **Nodemon**: Auto-restarts server on file changes
- **Body Parser**: Handles various request body formats
- **CORS**: Enables cross-origin requests from frontend

## 📝 API Response Formats

### Success Response

```json
{
  "data": {
    /* response data */
  },
  "status": 200
}
```

### Error Response

```json
{
  "error": "Error message",
  "status": 400/500
}
```

## 🔍 Common Operations

### Creating a New Shop

1. POST to `/auth/signup` with shop details
2. Shop document created with default menu
3. Returns shop ID for subsequent operations

### Adding Menu Items

1. Create category: POST `/admin/category`
2. Add items to category: PATCH `/admin/category`
3. Create modifiers: POST `/admin/modifier`
4. Assign modifiers to items

### Processing Orders

1. Customer scans QR code → `/menu/:shopid/:table`
2. Customer selects items and modifiers
3. POST to `/shop/checkout` with order details
4. Order saved and appears in admin dashboard

## 🚨 Error Handling

The API includes try-catch blocks for:

- Database operations
- File uploads
- Data validation
- Missing resources

## 🔄 Future Enhancements

- WebSocket support for real-time order updates
- Payment gateway integration
- Advanced analytics and reporting
- Multi-language support
- Email notifications
- Order status tracking

## 🤝 Contributing

When contributing to the backend:

1. Follow existing code structure and naming conventions
2. Add error handling for new endpoints
3. Update this README for new features
4. Test all endpoints before committing
5. Ensure database schema changes are documented

## 📚 Dependencies Reference

| Package            | Version | Purpose            |
| ------------------ | ------- | ------------------ |
| express            | Latest  | Web framework      |
| mongoose           | 7.5.0   | MongoDB ODM        |
| qrcode             | 1.5.3   | QR code generation |
| passport           | 0.6.0   | Authentication     |
| express-jwt        | 8.4.1   | JWT middleware     |
| express-fileupload | 1.5.0   | File uploads       |
| cookie-parser      | 1.4.6   | Cookie handling    |

## 🐛 Debugging

Enable MongoDB query logging:

```javascript
mongoose.set("debug", true);
```

Check server logs for:

- Database connection status
- Route registration
- Error messages
- Request/response data
