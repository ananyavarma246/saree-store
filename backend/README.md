# Alankree Saree Store - Backend System

A comprehensive e-commerce backend system with admin management for the Alankree Saree Store.

## 🚀 Features

### Order Management System
- **Customer Order Placement**: Authenticated users can place orders
- **Order Status Tracking**: Complete order lifecycle from pending to delivered
- **Admin Order Management**: Full CRUD operations for orders
- **Order Cancellation**: Customers can cancel orders before shipping
- **Delivery Management**: Assign delivery agents and track shipments
- **Real-time Notifications**: Admins get notified of new orders, cancellations

### Admin Dashboard
- **Dashboard Statistics**: Revenue, order counts, inventory status
- **Order Management**: View, update, and manage all orders
- **Inventory Management**: Add, update, delete products
- **User Management**: View customer information and order history
- **Notification System**: Real-time alerts for important events
- **Low Stock Alerts**: Automatic notifications for low inventory

### User Management
- **User Registration & Authentication**: JWT-based auth system
- **Profile Management**: Update personal information
- **Address Management**: Multiple delivery addresses
- **Cart System**: Add, remove, update cart items
- **Wishlist**: Save favorite products
- **Order History**: View past orders and track current ones

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin and user role separation
- **Protected Routes**: Middleware for route protection

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── adminController.js      # Admin functionality
│   │   ├── orderController.js      # Order management
│   │   ├── productController.js    # Product operations
│   │   ├── userController.js       # User management
│   │   └── notificationController.js # Notification system
│   ├── models/
│   │   ├── order.js               # Order schema
│   │   ├── product.js             # Product schema
│   │   └── user.js                # User schema
│   ├── routes/
│   │   ├── adminRoutes.js         # Admin endpoints
│   │   ├── orderRoutes.js         # Order endpoints
│   │   ├── productRoutes.js       # Product endpoints
│   │   ├── userRoutes.js          # User endpoints
│   │   └── notificationRoutes.js  # Notification endpoints
│   ├── middleware/
│   │   └── auth.js                # Authentication middleware
│   └── app.js                     # Main application file
├── config/
│   └── db.js                      # Database configuration
└── package.json
```

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file:
   ```env
   JWT_SECRET=your_jwt_secret_key
   ADMIN_JWT_SECRET=your_admin_jwt_secret
   MONGODB_URI=mongodb://localhost:27017/alankree-saree-store
   NODE_ENV=development
   PORT=5001
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system

4. **Run the Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/admin/login` - Admin login

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/user/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/track/:orderId` - Track order (public)
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin - Orders
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/recent` - Get recent orders
- `GET /api/admin/orders/status/:status` - Get orders by status
- `PUT /api/admin/orders/:orderId/status` - Update order status
- `PUT /api/admin/orders/:orderId/delivery` - Update delivery info
- `PUT /api/admin/orders/:orderId/assign-agent` - Assign delivery agent

### Admin - Dashboard
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/:productId` - Update product
- `DELETE /api/admin/products/:productId` - Delete product
- `GET /api/admin/inventory` - Get inventory status

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/cart` - Add to cart
- `GET /api/users/cart` - Get cart items
- `PUT /api/users/cart/:productId` - Update cart quantity
- `DELETE /api/users/cart/:productId` - Remove from cart
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:addressId` - Update address
- `DELETE /api/users/addresses/:addressId` - Delete address

### Notifications (Admin)
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/stats` - Get notification stats
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🔐 Admin Credentials

Default admin login credentials:
- **Email**: `admin@alankree.com`
- **Password**: `admin123`

## 📊 Database Schema

### Order Schema
```javascript
{
  user: { name, email, address },
  orderItems: [{ product, name, quantity, price, image }],
  paymentMethod: 'cod' | 'card' | 'upi',
  paymentResult: { status, transactionId },
  totalPrice: Number,
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  statusHistory: [{ status, updatedAt, notes, updatedBy }],
  delivery: { status, trackingNumber, agent, estimatedDelivery },
  timestamps: true
}
```

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  addresses: [{ name, street, city, state, pincode, country, isDefault }],
  role: 'user' | 'admin',
  cart: [{ product, quantity }],
  wishlist: [productId],
  preferences: { notifications, newsletter },
  timestamps: true
}
```

## 🔄 Order Workflow

1. **Order Placement**: Customer creates order → Status: `pending`
2. **Admin Confirmation**: Admin reviews → Status: `confirmed`
3. **Processing**: Order prepared → Status: `processing`
4. **Shipping**: Order dispatched → Status: `shipped`
5. **Delivery**: Order delivered → Status: `delivered`

## 📱 Notification System

Admins receive real-time notifications for:
- New order placements
- Order cancellations
- Low stock alerts
- Payment confirmations

## 🚨 Error Handling

- Comprehensive error handling middleware
- Validation errors with descriptive messages
- Authentication and authorization errors
- Database connection error handling

## 🔧 Development

### Adding New Features
1. Create model in `src/models/`
2. Add controller in `src/controllers/`
3. Define routes in `src/routes/`
4. Update main `app.js` with new routes

### Testing
Use tools like Postman or Insomnia to test API endpoints.

### Database Connection
The system uses MongoDB with Mongoose ODM for data modeling and validation.

## 📈 Performance Features

- Pagination for large datasets
- Efficient database queries with population
- JWT token expiration handling
- Memory-efficient notification storage

## 🛡️ Security Best Practices

- Password hashing with bcrypt
- JWT token validation
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data

---

**Your complete e-commerce backend system is now ready! 🎉**

The system provides everything needed for:
- Customer order management
- Admin dashboard and controls
- Inventory tracking
- User authentication and profiles
- Real-time notifications
- Comprehensive order tracking
